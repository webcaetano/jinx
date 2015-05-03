'use strict';

var gulp = require('gulp');
var flash = require('gulp-flash');
var browserSync = require('browser-sync');
var through = require('through2');
var path = require('path');
var fs = require('fs');
var runSequence = require('run-sequence');
var findup = require('findup-sync');
var globule = require('globule');
var _ = require('lodash');

var $ = require('gulp-load-plugins')({
	pattern: ['del']
});

function isOnlyChange(event) {
	return event.type === 'changed';
}

module.exports = function(options) {
	gulp.task('watch', ['scripts:watch'], function () {

		gulp.watch([options.src + '/*.html', 'bower.json'],function(){
			gulp.start('inject',function(){
				browserSync.reload();
			});
		});

		gulp.watch([
			options.src + '/{app,components,less}/**/*.css',
			options.src + '/{app,components,less}/**/*.scss'
		], function(event) {
			if(isOnlyChange(event)) {
				gulp.start('styles',function(){
					browserSync.reload();
				});
			} else {
				gulp.start('inject');
			}
		});


		gulp.watch(options.src + '/{app,components}/**/*.html', function(event) {
			browserSync.reload(event.path);
		});
	});

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

		pattern.push('!jinx');

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

	var getJinxPkgs = function(relativeTo){
		var allFiles = [];
		var pkgs = ['../'].concat(getJinxPkgsNames());
		var root = path.resolve('node_modules');
		var i;
		var files = {as:[],swc:[]};

		for(i in pkgs){
			var pkgFile = JSON.parse(fs.readFileSync(path.join(root, pkgs[i], 'package.json')));
			var jinxPkgFiles = getJinxPkgFiles(pkgFile);
			if(jinxPkgFiles.length) allFiles = allFiles.concat(addPkgPath(jinxPkgFiles,path.join(root, pkgs[i])));
		}
		for(i in allFiles){
			if(path.extname(allFiles[i])=='.as'){
				files['as'].push(pathToSrcFile(relativeTo,allFiles[i]));
			} else {
				files['swc'].push(pathToSrcFile('./',path.dirname(allFiles[i])));
			}
		}

		return files;
	}

	function build(done,end){
		var mainFile = options.tmp+'/as/app/flash/main.as'
		var pkgs = getJinxPkgs(mainFile);

		var libs = [
			options.src + '/app/flash/libs'
		].concat(pkgs.swc);

		runSequence('clean','copy_as', function(){
			gulp.src(mainFile)
			.pipe(through.obj(function(file, enc, callback){
				var fileContent = String(file.contents);
				if(fileContent.indexOf('// [[inject:jinx]]')!=-1 && pkgs.as.length){
					fileContent = fileContent.replace('// [[inject:jinx]]',"include '"+pkgs.as.join("';\n include '")+"';\n");
				}

				file.contents = new Buffer(fileContent);
				callback(null,file);
			}))
			.pipe(gulp.dest(path.dirname(mainFile)))
			.pipe(flash(options.src + '/app/flash/dist',{
				'debug':true, // enable this for detailed errors
				'library-path': libs
			}))
			.pipe(through.obj(function(file, enc, callback){
				if(done) done();
				if(end) process.exit();
			}));
		});
	}

	gulp.task('copy_as',function(done){
		gulp.src([
			options.src +'/**/*.as',
		])
		.pipe(gulp.dest(options.tmp+'/as'))
		.pipe(through.obj(function(file, enc, callback){
			done();
		}));
	});

	gulp.task('clean', function (done) {
		$.del([options.tmp+'/as'], done);
	});

	gulp.task('build', function (done) {
		build(done,true);
	});

	gulp.watch([options.src + '/app/flash/**/*.{as,swc}','jinx.as'], function(event) {
		build(function(){
			console.log('reloading');
			browserSync.reload(event.path);
		});
	});
};
