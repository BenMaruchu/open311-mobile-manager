'use strict';

//dependencies
const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const wiredep = require('wiredep').stream;
const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const cleanCss = require('gulp-clean-css');
const rev = require('gulp-rev');
const ngAnnotate = require('gulp-ng-annotate');


//paths
const paths = {
  index: './www/index.html',
  sass: ['./scss/**/*.scss']
};


//wiredep tasks
gulp.task('wiredep', function () {
  gulp.src(paths.index)
    .pipe(wiredep())
    .pipe(gulp.dest('./www'));
});


//usemin
gulp.task('usemin', function () {
  return gulp.src('./www/*.html')
    .pipe(usemin({
      css: [cleanCss(), rev()],
      html: [htmlmin({
        collapseWhitespace: true,
        conservativeCollapse: true,
        collapseBooleanAttributes: true,
        removeCommentsFromCDATA: true,
        removeComments: true
      })],
      js: [ngAnnotate(), /*uglify(),*/ rev()]
    }))
    .pipe(gulp.dest('build/'));
});


//sass tasks
gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

//watch task
gulp.task('watch', ['sass'], function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.index, ['wiredep']);
});

gulp.task('generate-service-worker', function (callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = 'www';

  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'],
    stripPrefix: rootDir,
    maximumFileSizeToCacheInBytes: 1024 * 1024 * 5
  }, callback);
});

//build task
//1. build app
//2. ionic build

//ionic view upload
//1. build app
//2. ionic upload

//default task
gulp.task('default', ['wiredep', 'sass']);
