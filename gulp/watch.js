'use strict';

var gulp = require('gulp');
var flash = require('gulp-flash');
var browserSync = require('browser-sync');
var through = require('through2');

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

	gulp.watch([options.src + '/app/flash/**/*.{as,swc}','jinx.as'], function(event) {
		gulp.src(options.src + '/app/flash/main.as')
		.pipe(flash(options.src + '/app/flash/dist',{
			'debug':true, // enable this for detailed errors
			'library-path': [
				options.src + '/app/flash/libs'
			]
		}))
		.pipe(through.obj(function(file, enc, callback){
			browserSync.reload(event.path);
		}));
	});
};
