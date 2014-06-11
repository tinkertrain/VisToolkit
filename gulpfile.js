'use strict';
var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var less = require('gulp-less');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var changed = require('gulp-changed');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');

gulp.task('clean', function() {
  return gulp.src('./css', {read: false})
  .pipe(clean());
});

gulp.task('css', function() {
  return gulp.src('less/main.less')
  .pipe(changed('./css'))
  .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ],
    sourcemap: true
  }))
  .pipe(autoprefixer('last 2 versions'))
  .pipe(gulp.dest('./css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(csso())
  .pipe(gulp.dest('./css'))
  .on('error', gutil.log);
});

gulp.task('browser-sync', function() {
    browserSync.init(['css/*.css', 'scripts/*.js', 'index.html'], {
        server: {
            baseDir: './'
        },
        notify: false
    });
});

gulp.task('default', ['css', 'browser-sync'], function () {
    gulp.watch('less/main.less', ['css']);
});