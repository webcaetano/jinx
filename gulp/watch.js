'use strict';

var gulp = require('gulp');
var flash = require('gulp-flash');
var browserSync = require('browser-sync');
var through = require('through2');
var path = require('path');
var fs = require('fs');
var runSequence = require('run-sequence');
var jinxLoader = require('jinx-loader');

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

	function build(done,end){
		var mainFile = options.tmp+'/as/app/flash/main.as'
		var pkgs = jinxLoader(mainFile);

		var libs = [
			options.src + '/app/flash/libs'
		].concat(pkgs.swc);

		runSequence('clean','copy_as', function(){
			gulp.src(mainFile)
			.pipe(through.obj(function(file, enc, callback){ // .AS Injection
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
