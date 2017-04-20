'use strict';

const autoprefixer = require('gulp-autoprefixer');
const fs = require('fs');
const gulp = require('gulp');
const headerLicense = require('gulp-header-license');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const vinylNamed = require('vinyl-named');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const webpackConfig = require('./webpack.config');

const SRC_DIR = './src';
const BUILD_DIR = './dist';

gulp.task('clean', () => del(BUILD_DIR));

gulp.task('configs', () => {
  return gulp.src(`${SRC_DIR}/*`).pipe(gulp.dest(BUILD_DIR));
});

gulp.task('icons', () => {
  return gulp.src(`${SRC_DIR}/icons/**/*.png`).pipe(gulp.dest(`${BUILD_DIR}/icons`));
});

gulp.task('scripts', () => {
  return gulp.src(`${SRC_DIR}/js/*.js`)
    .pipe(vinylNamed())
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(`${BUILD_DIR}/js`));
});

gulp.task('scripts:dist', ['scripts'], () => {
  return gulp.src(`${BUILD_DIR}/js/**/*.js`)
    .pipe(uglify())
    .pipe(headerLicense('/* ' + fs.readFileSync('./LICENSE') + '*/'))
    .pipe(gulp.dest(`${BUILD_DIR}/js`));
});

gulp.task('build', ['configs', 'icons', 'scripts']);

gulp.task('dist', ['scripts:dist']);

gulp.task('watch', ['build'], () => {
  return gulp.watch(`${SRC_DIR}/**/*`, ['build']);
});