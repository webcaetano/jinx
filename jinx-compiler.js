var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var str_replace = function(search, replace, subject, count) {
    var i = 0,    j = 0,    temp = '',    repl = '',    sl = 0,    fl = 0,    f = [].concat(search),    r = [].concat(replace),    s = subject,
    ra = Object.prototype.toString.call(r) === '[object Array]',
    sa = Object.prototype.toString.call(s) === '[object Array]';
    s = [].concat(s);
    if (count)this.window[count] = 0;

    for (i = 0, sl = s.length; i < sl; i++) {
        if (s[i] === '')continue;
        for (j = 0, fl = f.length; j < fl; j++) {
            temp = s[i] + '';
            repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
            s[i] = (temp).split(f[j]).join(repl);
            if (count && s[i] !== temp) this.window[count] += (temp.length - s[i].length) / f[j].length;
        }
    }
    return sa ? s : s[0];
}

var pathToSrcFile = function(src,dest){
	var p = path.relative(path.dirname(src),path.dirname(dest)).split('\\').join('/');
	return (p && p.length ? p+'/'+path.basename(dest) : dest);
}

function arrayify(el) {
	return Array.isArray(el) ? el : [el];
}

var getOnlyCompatible = function(files){
	files = arrayify(files);
	var resp = [];
	for(var i in files){
		if(isCompatible(files[i])) resp.push(files[i]);
	}
	return resp;
}

var isCompatible = function(file){
	var ext = ['.as','.swc'];
	for(var i in ext) {
		if(path.extname(file)==ext[i]) return true;
	}
	return false;
}

var getJinxPkgFiles = function(pkgs){
	pkgs = arrayify(pkgs);
	var resp = [];
	for(var i in pkgs){
		if(pkgs[i].main && isCompatible(pkgs[i].main)) resp.push(pkgs[i].main);
		if(pkgs[i].files) resp = resp.concat(getOnlyCompatible(pkgs[i].files));
	}
	return removeEmpty(resp);
}

var removeEmpty = function(arr){
	for(var i in arr){
		if(Array.isArray(arr[i]) && !arr[i].length) arr.splice(arr.indexOf(arr[i]),1);
	}
	return arr;
}

var getJinxPkgsNames = function(options){
	options = options || {};

	var pattern = arrayify(options.pattern || ['jinx-*']);
	var config = options.config || findup('package.json');
	var scope = arrayify(options.scope || ['dependencies', 'devDependencies', 'peerDependencies']);

	if (typeof config === 'string') config = require(path.resolve(config));

	pattern.concat(['!jinx','!jinx-loader']);

	var names = scope.reduce(function (result, prop) {
		return result.concat(Object.keys(config[prop] || {}));
	}, []);

	return globule.match(pattern, names)
}

var addPkgPath = function(files,pkgPath){
	files = arrayify(files);
	for(var i in files){
		files[i]=path.resolve(pkgPath+"/"+files[i]);
	}
	return files;
}


var loadModules = function(modules,file){
	var allFiles = [];
	var root = path.resolve('node_modules');
	var filesContent = [];

	for(i in modules){
		var pkgFile = JSON.parse(fs.readFileSync(path.join(root, modules[i], 'package.json')));
		var jinxPkgFiles = getJinxPkgFiles(pkgFile);
		if(jinxPkgFiles.length) allFiles = allFiles.concat(addPkgPath(jinxPkgFiles,path.join(root, modules[i])));
	}
	for(i in allFiles){
		if(path.extname(allFiles[i])=='.as'){
			filesContent.push(fs.readFileSync(allFiles[i]));
		}
	}

	var resp = [];
	for(i in filesContent){
		resp.push(['function(module, exports, __jinx_require__) {',
		filesContent[i],
		'}'].join('\n'));
	}

	return resp.join(",\n");
}

module.exports = function(file){
	var getFileName = function($){
		return path.basename($,path.extname($));
	}
	var fileContent = String(file.contents);
	var fileName = getFileName(file.path);
	var i;

	var asHeader = 'package {\n'+
	'import flash.display.Sprite;\n'+
	'public class '+fileName+' extends Sprite {\n'+
	'public function '+fileName+'() {\n';

	// console.log(fileContent)
	var search = [
		/require\('[a-zA-Z_\-\.]+'\)/g,
		/require\("[a-zA-Z_\-\.]+"\)/g
	] ;

	var modules = [];

	for(i in search){
		modules = modules.concat(fileContent.match(search[i]));
	}
	// fileContent.match();
	for(i in modules){
		modules[i] = modules[i].match(/['"][a-zA-Z_\-\.]+['"]/g)[0];
		modules[i] = modules[i].substr(1,modules[i].length-2);
	}

	modules = _.uniq(modules);

	modulesContents = loadModules(modules,file.path);

	var jinxHeader = '(function(modules) {\n'+
		'var installedModules = {};\n'+
		'function __jinx_require__(moduleId) {\n'+
			'if(installedModules[moduleId]) return installedModules[moduleId].exports;\n'+
			'var module = installedModules[moduleId] = {\n'+
				'exports: {},\n'+
				'id: moduleId,\n'+
				'loaded: false\n'+
			'};\n'+
			'modules[moduleId].call(module.exports, module, module.exports, __jinx_require__);\n'+
			'module.loaded = true;\n'+
			'return module.exports;\n'+
		'}\n'+
		'return __jinx_require__(0);\n'+
	'})\n';


	fileContent = asHeader+jinxHeader+'(['+modulesContents+'])'+fileContent+'\n'+
	'}}}\n';

	return fileContent;
}

// ([])
