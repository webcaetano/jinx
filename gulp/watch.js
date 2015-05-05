'use strict';

var gulp = require('gulp');
var flash = require('gulp-flash');
var browserSync = require('browser-sync');
var through = require('through2');
var path = require('path');
var fs = require('fs');
var jinxLoader = require('jinx-loader');
var jinxInject = require('gulp-jinx-inject');
var ext_replace = require('gulp-ext-replace');


var $ = require('gulp-load-plugins')({
	pattern: ['del']
});

function isOnlyChange(event) {
	return event.type === 'changed';
}

module.exports = function(options) {
	var tmpFolder = path.join(options.tmp,'jinx');

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



	gulp.task('c', ['copy'],function(){
		return gulp.src(path.join(tmpFolder,'app/flash/init.jinx'))
		.pipe(through.obj(function (file, enc, callback) {
			//file.contents = new Buffer(require('../jinx-compiler')(file));
			file.contents = new Buffer(require('../jinx-compiler')(file));
			callback(null,file);
		}))
		.pipe(ext_replace('.as'))
		.pipe(gulp.dest(tmpFolder));
	})

	gulp.task('copy',function(){
		return gulp.src([
			options.src +'/**/*.as',
		])
		.pipe(gulp.dest(tmpFolder));
	});


	gulp.task('build', ['copy'], function () {
		console.log('build')
		var mainFile = path.join(tmpFolder,'/app/flash/init.jinx');
		var pkgs = jinxLoader(mainFile);

		return gulp.src(path.join(options.src,'app/flash/init.jinx'))
		.pipe(through.obj(function (file, enc, callback) {
			//file.contents = new Buffer(require('../jinx-compiler')(file));
			file.contents = new Buffer(require('../jinx-compiler')(file));
			callback(null,file);
		}))
		.pipe(ext_replace('.as'))
		// .pipe(gulp.dest(tmpFolder))
		// .pipe(jinxInject(pkgs.as))
		.pipe(gulp.dest(path.dirname(mainFile)))
		.pipe(flash(options.src + '/app/flash/dist',{
			'debug':true, // enable this for detailed errors
			'library-path': [
				options.src + '/app/flash/libs'
			].concat(pkgs.swc)
		}));
	});

	gulp.watch([options.src + '/app/flash/**/*.{as,jinx,swc}'], function(event) {
		gulp.start('build',function(){
			browserSync.reload(event.path);
		});
	});
};
