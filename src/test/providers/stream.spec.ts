'use strict';

import * as assert from 'assert';
import * as Vinyl from 'vinyl';

import { ConfigService } from '../../services/config';
import { StorageService } from '../../services/storage';
import { StreamProvider } from '../../providers/stream';

import { normalize } from '../../utils/paths';

let passedFiles: string[] = [];
const options = {
	scanner: {
		exclude: [] as any[],
		depth: 30
	},
	log: (filepath: string) => {
		passedFiles.push(normalize(filepath));
	}
};

const config = new ConfigService('pug');
const storage = new StorageService();

describe('Providers/Stream', () => {

	afterEach(() => {
		passedFiles = [];
	});

	it('Should work', (done) => {
		const stream = new StreamProvider('fixtures', storage, config.getConfig(), options);
		const s = stream.run('fixtures/pug/c.pug');

		s.on('data', () => { /* Because Stream */ });
		s.on('error', (err: Error) => done(err));
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

	it('Should correct work with WIN32 paths', (done) => {
		const stream = new StreamProvider('fixtures', storage, config.getConfig(), options);
		const s = stream.run('fixtures\\pug\\c.pug');

		s.on('data', () => { /* Because Stream */ });
		s.on('error', (err: Error) => done(err));
		s.on('end', () => {
			assert.deepEqual(passedFiles, [
				'fixtures/pug/a.pug',
				'fixtures/pug/b.pug',
				'fixtures/pug/c.pug',
				'fixtures/pug/nested/nested.pug'
			]);

			done();
		});

		s.write(new Vinyl({ path: 'pug\\a.pug' }));
		s.write(new Vinyl({ path: 'pug\\b.pug' }));
		s.write(new Vinyl({ path: 'pug\\c.pug' }));
		s.write(new Vinyl({ path: 'pug\\nested\\nested.pug' }));
		s.write(new Vinyl({ path: 'pug\\parser.pug' }));

		s.end();
	});

	it('Vinyl file', (done) => {
		const vOptions = Object.assign({
			makeVinylFile: true
		}, options);

		const stream = new StreamProvider('fixtures', storage, config.getConfig(), vOptions);
		const s = stream.run('fixtures/pug/c.pug');

		s.on('data', (file: Vinyl) => {
			assert.ok(Buffer.isBuffer(file.contents));
		});

		s.on('error', (err: Error) => done(err));
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
		const stream = new StreamProvider('fixtures', storage, config.getConfig(), options);
		const s = stream.filter('fixtures/pug/parser.pug');

		s.on('data', () => { /* Because Stream */ });
		s.on('error', (err: Error) => done(err));
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
