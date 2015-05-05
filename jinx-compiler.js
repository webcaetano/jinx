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
			filesContent.push(warpModule(String(fs.readFileSync(allFiles[i]))));
		}
	}

	return filesContent;
	// var resp = [];
	// for(i in filesContent){
	// 	resp.push(['function(module, exports, __jinx_require__) {',
	// 	filesContent[i],
	// 	'}'].join('\n'));
	// }

	// return resp.join(",\n");
}

var warp = function(pre,content,suf,separator){
	return [pre,content,suf || pre].join((separator ? separator : ','));
}

var warpModule = function(content){
	return warp('function(module, exports, __jinx_require__) {',content,'}','\n');
}


var escapeRegExp = function(str) { // credits CoolAJ86
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
var replaceModules = function(str,modules){
	for(var i in modules){
		str = str.replace(getCard(escapeRegExp(modules[i])),'__jinx_require__('+(1+modules.indexOf(modules[i]))+')');
	}

	return str;
}


var getCard = function(mid){
	return new RegExp('require\\s*\\(\\s*\'['+mid+']+\'\\s*\\)|require\\s*\\(\\s*"['+mid+']+"\\s*\\)','g')
}

module.exports = function(file){
	var getFileName = function($){
		return path.basename($,path.extname($));
	}
	var fileContent = String(file.contents);
	var fileName = getFileName(file.path);
	var i;

	var asHeader = _.template(String(fs.readFileSync('template/_asHeader.js')))({fileName:fileName});

	var modules = [];

	modules = modules.concat(fileContent.match(getCard('a-zA-Z_\\-\\.')));

	for(i in modules){
		modules[i] = modules[i].match(/['"][a-zA-Z_\-\.]+['"]/g)[0];
		modules[i] = modules[i].substr(1,modules[i].length-2);
	}
	modules = _.uniq(modules);

	fileContent = replaceModules(fileContent,modules);

	var compilerHeader = String(fs.readFileSync('template/_compilerHeader.js'));
	var modulesContents = loadModules(modules,file.path);
	modulesContents.unshift(warpModule(fileContent));

	var resp = [asHeader,compilerHeader,'(['+modulesContents.join(',\n')+']);','}}}'].join('\n');

	// console.log(resp);
	return resp;
}

// ([])
