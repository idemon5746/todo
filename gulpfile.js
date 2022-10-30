var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browerSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    pug = require('gulp-pug'),
    clean = require('gulp-clean'),
    htmlbeautify = require('gulp-html-beautify'),
    plumber = require('gulp-plumber'),
    babel = require('gulp-babel'),
    injectCSS = require('gulp-inject-css'),
    notify = require('gulp-notify');

gulp.task('inject-css', ['sass', 'pug'], function() {
    gulp.src('app/*.html')
        .pipe(injectCSS())
        .pipe(gulp.dest('app/'));
});

// compile *.pug files to *.html files
gulp.task('pug', ['pug-clean'], function () {
    return gulp.src('app/pug/*.pug')
        .pipe(plumber({
            errorHandler: notify.onError()
        }))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('app'))
        .pipe(htmlbeautify())
});

// delete all *.html files in app folder
gulp.task('pug-clean', function () {
    return gulp.src('app/*.html', {read: false})
        .pipe(clean());
});

// compile *.sass files
gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('app/css'))
        .pipe(browerSync.reload({stream: true}))
});

// compile *.scss files
gulp.task('scss', function () {
    return gulp.src('app/sass/**/*.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('app/css'))
        .pipe(browerSync.reload({stream: true}))
});

// minify images
gulp.task('img', function () {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            une: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'))
});

// delete dist folder
gulp.task('clean', function () {
    return del.sync('dist');
});

// clear images cache
gulp.task('clear', function () {
    return cache.clearAll();
});

// configurations browser sync package
gulp.task('browser-sync', function () {
    browerSync({
        server: {
            baseDir: 'app/'
        },
        notify: false
    });
});

// creating a production version
gulp.task('build', ['clean', 'img', 'inject-css'], function () {
    gulp.src(['!app/css/libs.css', '!app/css/header.css', 'app/css/**/*.css']).pipe(gulp.dest('dist/css'));
    gulp.src('app/js/*.min.js').pipe(gulp.dest('dist/js'));
    gulp.src('app/webfonts/**/*').pipe(gulp.dest('dist/webfonts'));
    gulp.src('app/img/**/*').pipe(gulp.dest('dist/img'));
    gulp.src('app/*.html').pipe(gulp.dest('dist'));
});

// monitoring project files
gulp.task('watch', ['browser-sync', 'inject-css'], function () {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/sass/**/*.scss', ['scss']);
    gulp.watch('app/*.html', browerSync.reload);
    gulp.watch('app/pug/**/*.pug', ['inject-css']);
    gulp.watch('app/js/*.js', [], browerSync.reload);
});

// default task
gulp.task('default', ['watch']);
