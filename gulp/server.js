'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var middleware = require('./proxy');

module.exports = function(options) {

	function browserSyncInit(baseDir, browser) {
		browser = browser === undefined ? 'default' : browser;

		var routes = null;
		if(baseDir === options.src || (util.isArray(baseDir) && baseDir.indexOf(options.src) !== -1)) {
			routes = {
				'/bower_components': 'bower_components'
			};
		}

		var server = {
			baseDir: baseDir,
			routes: routes
		};

		if(middleware.length > 0) {
			server.middleware = middleware;
		}

		browserSync.instance = browserSync.init({
			startPath: '/',
			server: server,
			browser: browser
		});
	}

	gulp.task('serve',['inject'], function () {
		gulp.start('watch', function(){
			browserSyncInit([options.tmp + '/serve', options.src]);
		});
	});
};
