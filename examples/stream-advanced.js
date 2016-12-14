// npm i gulpjs/gulp#4.0 gulp-if gulp-pug emitty
const gulp = require('gulp');
const gulpif = require('gulp-if');
const pug = require('gulp-pug');
const emitty = require('emitty').setup('app/templates', 'pug', {
	makeVinylFile: true
});

// Your "watch" task
gulp.task('watch', () => {
	// Shows that run "watch" mode
	global.watch = true;

	gulp.watch('app/templates/**/*.pug', gulp.series('templates'))
		.on('all', (event, filepath, stats) => {
			global.emittyChangedFile = {
				path: filepath,
				stats
			};
		});
});

gulp.task('templates', () => {
	const sourceOptions = global.watch ? { read: false } : {};

	return gulp.src('app/templates/*.pug', sourceOptions)
		.pipe(gulpif(global.watch, emitty.stream(global.emittyChangedFile.path, global.emittyChangedFile.stats)))
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest('build'))
});
