var gulp 			= require('gulp');
var plumber 		= require('gulp-plumber');
var less 			= require('gulp-less');
var rename 			= require('gulp-rename');
var minify			= require('gulp-minify-css');
var sourcemaps 		= require('gulp-sourcemaps');
var gutil			= require('gulp-util');
var autoprefixer 	= require('gulp-autoprefixer');
var concat			= require('gulp-concat');
var remember		= require('gulp-remember');
var cached			= require('gulp-cached');
var duration		= require('gulp-duration');
var watch			= require('gulp-watch');
var changed			= require('gulp-changed');
var path 			= require('path');
var source 			= require('vinyl-source-stream');

// Different sources
var bootstrapMain = 'bootstrap/bootstrap.less';
var bootstrapGlob = [
	'./bootstrap/**/*.less',
	'!./bootstrap/bootstrap.less',
	'!./bootstrap/mixins.less'
];
var noImports = './no_imports/**/*.less';

// For switching sources faster
//var glob = bootstrapMain;
//var glob = bootstrapGlob;
var glob = noImports;

// Default task
gulp.task('default', ['watch']);

// Build task
gulp.task('less', function () {
	return gulp.src(glob)
		.pipe(cached('less'))
		.pipe(remember('less'))
		.pipe(concat('onefile.less'))
		.pipe(less())
		.pipe(minify())
		.pipe(autoprefixer())
		.pipe(gulp.dest('output'));
});

// Watcher task
gulp.task('watch', function () {
	var watcher = gulp.watch(glob, ['less']);
	watcher.on('change', function (e) {
		if (e.type === 'deleted') {
			delete cached.caches.scripts[e.path];
			remember.forget('less', e.path);
		}
	});
});