// npm i gulpjs/gulp#4.0 gulp-if gulp-pug emitty
const gulp = require('gulp');
const gulpif = require('gulp-if');
const emitty = require('emitty').setup('app/templates', 'pug');
const pug = require('gulp-pug');

// Your "watch" task
gulp.task('watch', () => {
	// Shows that run "watch" mode
	global.watch = true;

	gulp.watch('app/templates/**/*.pug', gulp.series('templates'));
});

gulp.task('templates', () =>
	gulp.src('app/templates/*.pug')
		.pipe(gulpif(global.watch, emitty.stream()))
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest('build'))
);
