'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function(options) {
  gulp.task('inject', ['scripts'], function () {


    var injectScripts = gulp.src([
      options.tmp + '/serve/{app,components}/**/*.js',
      '!' + options.src + '/{app,components}/**/*.spec.js',
      '!' + options.src + '/{app,components}/**/*.mock.js'
    ], { read: false });

    var injectOptions = {
      ignorePath: [options.src, options.tmp + '/serve'],
      addRootSlash: false
    };

    var wiredepOptions = {
      directory: 'bower_components'
    };

    return gulp.src(options.src + '/*.html')
      .pipe($.inject(injectScripts, injectOptions))
      .pipe(wiredep(wiredepOptions))
      .pipe(gulp.dest(options.tmp + '/serve'));

  });
};
