'use strict';

import * as assert from 'assert';
import * as Vinyl from 'vinyl';

import { Config } from '../../services/config';
import { Storage } from '../../services/storage';
import { Stream } from '../../providers/stream';

import { normalize } from '../../utils/paths';

let passedFiles: string[] = [];
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

describe('Providers/Stream', () => {

	afterEach(() => {
		passedFiles = [];
	});

	it('Should work', (done) => {
		const stream = new Stream('fixtures', storage, config.getConfig(), options);
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

		s.write(new Vinyl({ path: 'pug/a.pug' }));
		s.write(new Vinyl({ path: 'pug/b.pug' }));
		s.write(new Vinyl({ path: 'pug/c.pug' }));
		s.write(new Vinyl({ path: 'pug/nested/nested.pug' }));
		s.write(new Vinyl({ path: 'pug/parser.pug' }));

		s.end();
	});

	it('Vinyl file', (done) => {
		const vOptions = Object.assign({
			makeVinylFile: true
		}, options);

		const stream = new Stream('fixtures', storage, config.getConfig(), vOptions);
		const s = stream.run('fixtures/pug/c.pug');

		s.on('data', (file: Vinyl) => {
			assert.ok(Buffer.isBuffer(file.contents));
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

		s.write(new Vinyl({ path: 'pug/a.pug' }));
		s.write(new Vinyl({ path: 'pug/b.pug' }));
		s.write(new Vinyl({ path: 'pug/c.pug' }));
		s.write(new Vinyl({ path: 'pug/nested/nested.pug' }));
		s.write(new Vinyl({ path: 'pug/parser.pug' }));

		s.end();
	});

	it('Filter method', (done) => {
		const stream = new Stream('fixtures', storage, config.getConfig(), options);
		const s = stream.filter('fixtures/pug/parser.pug');

		s.on('data', (file: Vinyl) => {
			// Because Stream
		});

		s.on('error', (err) => {
			done(err);
		});

		s.on('end', () => {
			assert.deepEqual(passedFiles, [
				'fixtures/pug/parser.pug'
			]);

			done();
		});

		s.write(new Vinyl({ path: 'pug/a.pug' }));
		s.write(new Vinyl({ path: 'pug/b.pug' }));
		s.write(new Vinyl({ path: 'pug/c.pug' }));
		s.write(new Vinyl({ path: 'pug/nested/nested.pug' }));
		s.write(new Vinyl({ path: 'pug/parser.pug' }));

		s.end();
	});

});
