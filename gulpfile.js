var gulp = require('gulp'),
  sass = require('gulp-sass'),
  pug = require('gulp-pug'),
  autoprefixer = require('gulp-autoprefixer'),
  uncss = require('gulp-uncss'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  browserSync = require('browser-sync');

var settings = {
  publicDir: "",
  pugDir: "pug",
  sassDir: "assets/sass",
  cssDir: "assets/css",
  jsDir: "assets/js",
  minJsDir: "assets/js/min",
  imgDir: "assets/img",
  originalImgDir: "assets/img/original"
};

// Pug
gulp.task('pug', function () {
	return gulp.src(settings.pugDir + "/*.pug")
        .pipe(pug({
            //pretty: true,
						basedir: __dirname
        }))
        .pipe(gulp.dest(settings.publicDir))
        .pipe(browserSync.reload({stream: true}));
});

// SASS
gulp.task('sass', function () {
  return gulp.src(settings.sassDir + "/*.sass")
    .pipe(sass({
      includePath: [settings.sassDir],
      onError: browserSync.notify,
      outputStyle: 'compressed'
    })
      .on('error', sass.logError))
    .pipe(autoprefixer(['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'], {cascade: true}))
    .pipe(uncss({
      html: ['index.html']
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(settings.cssDir))
    .pipe(browserSync.reload({ stream: true }));
});

// Scripts
gulp.task('scripts', function () {
  return gulp.src(settings.jsDir + '/*.js')
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(settings.minJsDir))
    .pipe(browserSync.reload({ stream: true }));
});

// Images
gulp.task('images', function() {
  return gulp.src(settings.originalImgDir + '/**')
    .pipe(cache(imagemin(
      {
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3
      }
    )))
    .pipe(gulp.dest(settings.imgDir))
    .pipe(browserSync.reload({ stream: true }));
});


// Browser Sync
gulp.task('browser-sync', ['sass', 'pug', 'scripts', 'images'], function () {
  browserSync({
    server: {
      baseDir: settings.publicDir
    },
    notify: false
  });
});

// Watch
gulp.task('watch', function () {
  gulp.watch(settings.sassDir + '/**', ['sass']);
  gulp.watch(['*.pug', '**/*.pug'], ['pug']);
  gulp.watch(settings.jsDir + '/**', ['scripts']);
  gulp.watch(settings.originalImgDir + '/**', ['images']);
});

//default
gulp.task('default', ['browser-sync', 'watch']);
