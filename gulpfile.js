import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import del from 'del';
import browser from 'browser-sync';

// Styles

export const styles = () => gulp.src('source/less/style.less', {
  sourcemaps: true
})
  .pipe(plumber())
  .pipe(less())
  .pipe(postcss([
    autoprefixer(),
    csso()
  ]))
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css', {
    sourcemaps: '.'
  }))
  .pipe(browser.stream());

// HTML

const html = () => gulp.src('source/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(gulp.dest('build'));

// Scripts

const scripts = () => gulp.src('source/js/**/*.js')
  .pipe(gulp.dest('build/js'))
  .pipe(browser.stream());

// Images

const optimizeImages = () => gulp.src('source/img/**/*.{png,jpg,jpeg}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));

const copyImages = () => gulp.src('source/img/**/*.{png,jpg,jpeg}')
  .pipe(gulp.dest('build/img'));

// SVG

const svg = () =>
  gulp.src('source/img/**/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));

// Fonts

const fonts = () =>
  gulp.src('source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));

// Copy

const copy = (done) => {
  gulp.src(" ", {
    base: 'source'
  })
    .pipe(gulp.dest('build'));
  done();
};

// Clean

const clean = () => del('build');

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Reload

const reload = (done) => {
  browser.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/**/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
};

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg
  ),
);

// Default

export default gulp.series(
  clean,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    fonts
  ),
  gulp.series(
    server,
    watcher
  ));
