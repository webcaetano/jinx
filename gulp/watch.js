'use strict';

var gulp = require('gulp');
var jinxCompiler = require('gulp-jinx-compiler');
var browserSync = require('browser-sync');
var through = require('through2');
var path = require('path');
var fs = require('fs');

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

	gulp.task('build', function () {
		var mainFile = 'app/flash/init.jinx';

		return gulp.src(path.join(options.src,mainFile))
		.pipe(jinxCompiler(options.src+'/app/flash/dist',{
			'library-path': [
				options.src + '/app/flash/libs'
			]
		}))
	});

	gulp.watch([options.src + '/app/flash/**/*.{as,jinx,swc}'], function(event) {
		gulp.start('build',function(){
			browserSync.reload(event.path);
		});
	});
};
