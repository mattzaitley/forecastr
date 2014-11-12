var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	del = require('del');

gulp.task('styles', function() {
	return gulp.src('src/css/*.scss')
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		.pipe(sass({ style: 'expanded' }))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'android 4'))
		// .pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/assets/css'))
		// .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		// .pipe(concat('scripts.js'))
		// .pipe(gulp.dest('dist/assets/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js'))
		// .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
	return gulp.src('src/img/**/*')
		.pipe(plumber())
		.pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
		.pipe(gulp.dest('dist/assets/images'))
		.pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function(cb) {
	del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});

gulp.task('default', ['clean'], function() {
	gulp.start('styles', 'scripts', 'images');
});

gulp.task('watch', function() {

	// Watch .scss files
	gulp.watch('src/css/**/*.scss', ['styles']);

	// Watch .js files
	gulp.watch('src/js/**/*', ['scripts']);

	// Watch image files
	gulp.watch('src/img/**/*', ['images']);

	// Create LiveReload server
	livereload.listen();
	 
	// Watch any files in dist/, reload on change
	gulp.watch(['dist/**/*']).on('change', livereload.changed);

});