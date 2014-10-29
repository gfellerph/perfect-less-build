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

var fileGlob = [
	'./bootstrap/**/*.less',
	'!./bootstrap/bootstrap.less',
	'!./bootstrap/mixins.less'
];


gulp.task('default', function (){
	console.log('success');
});

gulp.task('less-single-file', function (){
	var singleFileTimer = duration('Single File Timer');

	 return gulp.src('./bootstrap/bootstrap.less')
	//.pipe( plumber() )
	.once('data', singleFileTimer.start)
	.pipe( sourcemaps.init() )
	.pipe( less() )
	.pipe( sourcemaps.write() )
	.pipe( autoprefixer() )
	.pipe( gulp.dest('output') )
	.pipe( rename('bootstrap.min.css') )
	.pipe( minify() )
	.pipe( singleFileTimer )
	.pipe( gulp.dest('output') )
});

var bootstrapMain = [
	'bootstrap/bootstrap.less'
];
gulp.task('less', function () {
	return gulp.src(fileGlob)
		.pipe(cached('lessFiles'))
		.pipe(remember('lessFiles'))
		.pipe(less())
		.pipe(gulp.dest('output'));
});

gulp.task('watch', function () {
	var watcher = gulp.watch(fileGlob, ['less']);
	watcher.on('change', function (e) {
		if (e.type === 'deleted') {
			delete cached.caches.scripts[e.path];
			remember.forget('lessFiles', e.path);
		}
	});
});