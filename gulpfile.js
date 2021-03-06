// jshint ignore: start
//
const
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  eslint = require('gulp-eslint'),
  webserver = require('gulp-webserver'),
  minifyCss = require('gulp-minify-css'),
  todo = require('gulp-todo'),
  babel = require('gulp-babel'),
  sourcemaps = require('gulp-sourcemaps'),
  ngAnnotate = require('gulp-ng-annotate'),
  uglify = require('gulp-uglify'),
  plumber = require('gulp-plumber');

const
  paths = {
    sass: ['./scss/**/*.scss'],
    vendor: [],
    app: [
      'app/js/src/**/*.js',
      'app/js/index.js',
      '!app/js/**/*.spec.js'
    ]
  };

gulp.task('default', ['serve', 'watch']);

gulp.task('sass', () => {
  return gulp.src(paths.sass)
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(sass())
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(concat('poppy.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', () => {
  return gulp.src(paths.app)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('watch', () => {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.app, ['lint', 'todo', 'source']);
});

gulp.task('serve', ['watch'], () => {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      open: false,
      port: 8000
    }));
});

gulp.task('todo', () => {
  gulp.src('app/js/**/*.js')
    .pipe(todo())
    .pipe(gulp.dest('./'));
});

gulp.task('source', () => {
  return gulp.src(
      paths.app
    )
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('poppy.min.js', { newLine: ';' }))
    .pipe(ngAnnotate({ add: true }))
    // .pipe(uglify({ mangle: true }))
    .pipe(plumber.stop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('vendor', () => {
  return gulp.src(
      paths.vendor
    )
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('vendor.min.js', { newLine: ';' }))
    .pipe(ngAnnotate({ add: true }))
    .pipe(uglify({ mangle: true }))
    .pipe(plumber.stop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['source']);