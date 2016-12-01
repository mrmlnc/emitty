'use strict';

import * as assert from 'assert';
import Vinyl = require('vinyl');

import { Config } from '../../services/config';
import { Storage } from '../../services/storage';
import { Stream } from '../../providers/stream';

import { normalize } from '../../utils/paths';

const passedFiles: string[] = [];
const options = {
	scanner: {
		exclude: [],
		depth: 30
	},
	log: (filepath: string) => {
		passedFiles.push(normalize(filepath));
	}
};

const config = new Config('pug');
const storage = new Storage();
const stream = new Stream(storage, options, config.getConfig(), 'fixtures');

describe('Providers/Stream', () => {

	it('Should work', (done) => {
		const s = stream.run('fixtures/pug/c.pug');

		s.on('data', (file: Vinyl) => {
			// Because Stream
		});

		s.on('error', (err) => {
			done(err);
		});

		s.on('end', () => {
			assert.deepEqual(passedFiles, [
				'fixtures/pug/a.pug',
				'fixtures/pug/b.pug',
				'fixtures/pug/c.pug',
				'fixtures/pug/nested/nested.pug'
			]);

			done();
		});

		s.write(new Vinyl({ path: 'fixtures/pug/a.pug' }));
		s.write(new Vinyl({ path: 'fixtures/pug/b.pug' }));
		s.write(new Vinyl({ path: 'fixtures/pug/c.pug' }));
		s.write(new Vinyl({ path: 'fixtures/pug/nested/nested.pug' }));
		s.write(new Vinyl({ path: 'fixtures/pug/parser.pug' }));

		s.end();
	});

});
