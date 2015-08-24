// Include gulp
var gulp = require('gulp');

// Include plugins
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
  replaceString: /\bgulp[\-.]/
});

// Define default destination folder
var dest = 'out/';

// Clean, concat, and uglify JS Bower components
gulp.task('cleanVendorScripts', function () {
  return gulp.src('out/scripts/vendor/*.js', {read: false})
    .pipe(plugins.clean());
});

gulp.task('vendorScripts', ['cleanVendorScripts'], function() {
  return gulp.src(plugins.mainBowerFiles())
    .pipe(plugins.filter('*.js'))
    .pipe(plugins.order([
      'jquery.js',
      '*'
    ]))
    .pipe(plugins.concat('vendor.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(dest + 'scripts/vendor'));
});

// Clean, concat, and uglify CSS Bower components
gulp.task('cleanVendorStyles', function () {
  return gulp.src('out/styles/vendor/*.css', {read: false})
    .pipe(plugins.clean());
});

gulp.task('vendorStyles', ['cleanVendorStyles'], function() {
  return gulp.src(plugins.mainBowerFiles())
    .pipe(plugins.filter('*.css'))
    .pipe(plugins.order([
      'pure.css',
      '*'
    ]))
    .pipe(plugins.concat('vendor.css'))
    .pipe(gulp.dest(dest + 'styles/vendor'));
});

// Clean less imports
gulp.task('cleanLessImports', function () {
  return gulp.src('out/styles/*.less', {read: false})
    .pipe(plugins.clean());
});

// Default task
gulp.task('default', ['vendorScripts','vendorStyles','cleanLessImports']);
