const gulp = require('gulp');
const gulpIf = require('gulp-if');
const through2 = require('through2');
const debug = require('gulp-debug');

const emitty = require('@emitty/core').configure();

emitty.language({
	extensions: ['.pug'],
	parser: require('@emitty/language-pug').parse
});

const state = {
	isWatchMode: false,
	// Changed files are written by the name of the task that will process them.
	// This is necessary to support more than one language in @emitty.
	watch: {
		templates: undefined
	}
};

function getFilter(taskName) {
	return through2.obj(function (file, _encoding, callback) {
		emitty.filter(file.path, state.watch[taskName]).then((result) => {
			if (result) {
				this.push(file);
			}

			callback();
		});
	});
}

gulp.task('templates', () =>
	gulp.src('./fixtures/*.pug')
		.pipe(gulpIf(state.isWatchMode, getFilter('templates'))) // Enables filtering only in watch mode
		.pipe(debug()) // Simulates compilation
);

gulp.task('watch:templates', () =>
	gulp.watch('./fixtures/**/*.pug', gulp.series('templates'))
		.on('all', (event, changed) => {
			// Logs the changed file for the templates task
			state.watch.templates = changed;
		})
);

gulp.task('watch:init', (done) => {
	// Enables the watch mode for conditions
	state.isWatchMode = true;

	done();
});

gulp.task('watch', gulp.series('watch:init', 'templates', 'watch:templates'));
