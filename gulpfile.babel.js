import gulp from 'gulp'
import rimraf from 'rimraf'
import sass from 'gulp-sass'
import browserSyncModule from 'browser-sync'
import autoprefixer from 'gulp-autoprefixer'
import gutil from 'gulp-util'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import inlineCss from 'gulp-inline-css'

var browserSync = browserSyncModule.create()

const config = {
  inFiles: {
    path: 'src/',
    html: 'src/*.html',
    css:  'src/*.{sass,scss,css}'
  },
  outFiles: {
    path: 'build/',
    html: 'build/*.html'
  }
}

gutil.log('- - - - - - - - - - - - - - -')
gutil.log('          Starting!          ')
gutil.log('')
gutil.log(' _._     _,-\'""`-._')
gutil.log('(,-.`._,\'(       |\`-/|')
gutil.log('    `-.-\' \ )-`( , o o)')
gutil.log('-bf-      `-    \`_`"\'-')
gutil.log('')
gutil.log('- - - - - - - - - - - - - - -')

// -------------------------------------------------------
//
// DEVELOPMENT TASK
//
// -------------------------------------------------------

// -------------------------------------------------------
// Utility: A `rm -rf` util for nodejs
gulp.task('clean', function (cb) {
  return rimraf(config.outFiles.path, cb)
})

// -------------------------------------------------------
// Development: Open server
gulp.task('server', function () {
  return browserSync.init({
    server: {baseDir: config.outFiles.path},
    ui: false,
  })
})

// -------------------------------------------------------
// Development: Compile Sass
gulp.task('sass', function () {
  return gulp.src(config.inFiles.css)
    .pipe(plumber({errorHandler: (err) => {
        notify.onError({ title: "Gulp", subtitle: "Failure!", message: "Error: <%= error.message %>", sound: "Beep" })(err)
        this.emit("end")
      }
    }))
    .pipe(sass({includePaths: 'node_modules/'}))
    .pipe(autoprefixer({ browsers: ['> 5% in IT', 'ie >= 8'] }))
    .pipe(gulp.dest(config.outFiles.path))
    .pipe(notify({ message: 'Sass compiled' }))
    .pipe(browserSync.stream())
})

// -------------------------------------------------------
// Development: Copy HTML files
gulp.task('html', ['sass'], function () {
  return gulp.src(config.inFiles.html)
    .pipe(inlineCss({
      url: "file://" + __dirname + "/" + config.outFiles.path
    }))
    .pipe(gulp.dest(config.outFiles.path))
    .pipe(browserSync.stream())
})

// -------------------------------------------------------
// Development: Copy Images files
gulp.task('copy:images', function () {
  return gulp.src(['src/images/**/*'])
  .pipe(gulp.dest(config.outFiles.path + 'images'))
  .pipe(notify({ message: 'Copy images task complete' }))
});

// -------------------------------------------------------
gulp.task('watch', ['html', 'server', 'copy:images'], function () {
  gulp.watch(config.inFiles.css, ['html'])
  gulp.watch(config.inFiles.html, ['html', 'copy:images'])
})
