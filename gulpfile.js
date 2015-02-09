var gulp                 = require('gulp');
var less                 = require('gulp-less');
var concat               = require('gulp-concat');
var remember             = require('gulp-remember');
var cached               = require('gulp-cached');
var sourcemaps           = require('gulp-sourcemaps');
var changed              = require('gulp-changed');
var using                = require('gulp-using');
var lessPluginCleanCSS   = require('less-plugin-clean-css');
var lessPluginAutoprefix = require('less-plugin-autoprefix');

var dest = './output';
var glob = ['./less/**/*.less'];
var browsers = [
	'Android >= 2.3',
	'Chrome >= 20',
	'Firefox >= 24', // Firefox 24 is the latest ESR
	'Explorer >= 8',
	'iOS >= 6',
	'Opera >= 12',
	'Safari >= 6'
];
var autoprefix = new lessPluginAutoprefix({browsers: browsers});
var cleancss = new lessPluginCleanCSS();

// Default task
gulp.task('default', ['less', 'watch']);

// Build task
gulp.task('less', function () {
	return gulp.src(glob)
		.pipe(cached('less'))
		.pipe(sourcemaps.init())
		.pipe(
			less(
				{
					plugins: []
				}
			)
		)
		.on('error', function (err, some) {
			console.log(err, some);
		})
		.pipe(using())
		.pipe(remember('css'))
		.pipe(concat('main.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dest));
});

// Watcher task
gulp.task('watch', function () {
	var watcher = gulp.watch(glob, ['less']);
	watcher.on('change', function (e) {
		if (e.type === 'deleted') {
			delete cached.caches.scripts[e.path];
			remember.forget('css', e.path);
		}
	});
});