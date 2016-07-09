var gulp               = require('gulp')
var browserify         = require('browserify')
var source             = require('vinyl-source-stream')
var sass               = require('gulp-sass')
var buffer             = require('vinyl-buffer')
var babelify           = require('babelify')
var pug                = require('gulp-pug')
var plumber            = require('gulp-plumber')
var rename             = require('gulp-rename')
var sourcemaps         = require('gulp-sourcemaps')
var cleanCSS           = require('gulp-clean-css')
var uglify             = require('gulp-uglify')
var vueify             = require('vueify')
var autoprefixer       = require('gulp-autoprefixer')
var historyApiFallback = require('connect-history-api-fallback')
var replace            = require('gulp-replace-task')
var args               = require('yargs').argv
var fs                 = require('fs')
var browserSync        = require('browser-sync').create()

// Enviorment settings
var env = args.env || 'dev'
var filename = 'env.config.' + env + '.json'
var settings = JSON.parse(fs.readFileSync('src/' + filename, 'utf8'))

// Pug template
gulp.task('pug', function () {
  return gulp.src('src/*.pug')
  .pipe(plumber())
  .pipe(pug())
  .pipe(replace({
      patterns: [
            {
                match: 'SOCKET',
                replacement: settings.SOCKET
            },
            {
                match: 'API',
                replacement: settings.API
            },
          ]
      }))
  .pipe(gulp.dest('./dist'))
})

// Sass
gulp.task('sass', function() {
  return gulp.src("src/scss/*.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
});

// Browserify
gulp.task('build', function () {
  return browserify('./src/main.js')
    .transform(babelify)
    .transform(vueify)
    .bundle()
    .pipe(plumber())
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(replace({
      patterns: [
            {
                match: 'SOCKET',
                replacement: settings.SOCKET
            },
            {
                match: 'API',
                replacement: settings.API
            },
          ]
      }))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/'))
})

// Static server
gulp.task('serve', ['watch'], function () {
    browserSync.init({
        server: {
            baseDir: "./dist",
            middleware: [ historyApiFallback() ]
        },
        ghostMode: false
    })
})

gulp.task('watch', ['sass', 'build', 'pug'], function () {
    gulp.watch('src/scss/**/*.scss', ['sass'])
    gulp.watch(['src/**/*.js', 'src/**/*.vue'], ['build'])
    gulp.watch('src/*.pug', ['pug'])
    gulp.watch(['dist/**/*', '!dist/**/*.css']).on('change', browserSync.reload)
})

gulp.task('default', ['serve'])

gulp.task('deploy', ['sass', 'build', 'pug'])
