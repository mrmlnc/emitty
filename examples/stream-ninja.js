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
		.on('all', (event, filepath) => {
			global.emittyChangedFile = filepath;
		});
});

gulp.task('templates', () =>
	new Promise((resolve, reject) => {
		const sourceOptions = global.watch ? { read: false } : {};

		emitty.scan(global.changedStyleFile).then(() => {
			gulp.src('app/templates/*.pug', sourceOptions)
				.pipe(gulpif(global.watch, emitty.filter(global.emittyChangedFile)))
				.pipe(pug({ pretty: true }))
				.pipe(gulp.dest('build'))
				.on('end', resolve)
				.on('error', reject);
		});
	})
);
