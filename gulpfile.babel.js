var gulp = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    autoprefixer = require('gulp-autoprefixer'),
    uncss = require('gulp-uncss'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    babel = require('gulp-babel'),
    minify = require("gulp-babel-minify"),
    util = require('gulp-util'),
    connect = require('gulp-connect');

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
        .pipe(connect.reload());
});

// SASS
gulp.task('sass', function () {
  return gulp.src(settings.sassDir + "/*.sass")
    .pipe(sass({
      includePath: [settings.sassDir],
      outputStyle: 'compressed'
    })
    .on('error', function(err) {
        util.log(util.colors.red('[Compilation Error]'));
        util.log(err.fileName + ( err.loc ? `( ${err.loc.line}, ${err.loc.column} ): ` : ': '));
        util.log(util.colors.red('error SASS: ' + err.message + '\n'));
        util.log(err.codeFrame);
        this.emit('end');
      }))
    .pipe(autoprefixer(['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'], {cascade: true}))
    // .pipe(uncss({
    //   html: ['index.html', 'iframe-template.html']
    // }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(settings.cssDir))
    .pipe(connect.reload());
});

// Scripts
gulp.task('scripts', function () {
  return gulp.src(settings.jsDir + '/*.js')
    .pipe(rename({ suffix: '.min' }))
    .pipe(babel({
            presets: ['es2015', 'env', ["minify", {
              "mangle": false
            }]]
      }).on('error', function(err) {
          util.log(util.colors.red('[Compilation Error]'));
          util.log(err.fileName + ( err.loc ? `( ${err.loc.line}, ${err.loc.column} ): ` : ': '));
          util.log(util.colors.red('error Babel: ' + err.message + '\n'));
          util.log(err.codeFrame);
          this.emit('end');
        }))
    .pipe(gulp.dest(settings.minJsDir))
    .pipe(connect.reload());
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
    .pipe(connect.reload());
});

gulp.task('connect', function () {
  connect.server({
    livereload: true
  })
})

// Watch
gulp.task('watch', function () {
  gulp.watch(settings.sassDir + '/**', ['sass']);
  gulp.watch(['*.pug', '**/*.pug'], ['pug']);
  gulp.watch(settings.jsDir + '/**', ['scripts']);
  gulp.watch(settings.originalImgDir + '/**', ['images']);
});

//default
gulp.task('default', ['connect', 'watch']);
