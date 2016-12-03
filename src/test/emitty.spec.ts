'use strict';

import * as assert from 'assert';

import { IStorage } from '../services/storage';

import * as emitty from '../emitty';

describe('Assert input', () => {

	it('Error by directory', () => {
		try {
			emitty.setup(null, null);
		} catch (err) {
			assert.equal(err, 'TypeError: directory must be a string');
		}
	});

	it('Error by directory not exists', () => {
		try {
			emitty.setup('dir', 'jade');
		} catch (err) {
			assert.equal(err, 'Error: directory must exist');
		}
	});

	it('Error by language', () => {
		try {
			emitty.setup('dir', null);
		} catch (err) {
			assert.equal(err, 'TypeError: language must be a string or an object');
		}
	});

	it('Error by broken language', () => {
		try {
			emitty.setup('src', 123);
		} catch (err) {
			assert.equal(err, 'TypeError: language must be a string or an object');
		}
	});

});

describe('API', () => {

	const snapshot: IStorage = {
		'a.pug': {
			dependencies: ['b.pug'],
			ctime: new Date()
		},
		'b.pug': {
			dependencies: [],
			ctime: new Date()
		}
	};

	it('Should load snapshot', () => {
		const api = emitty.setup('fixtures', 'pug', { snapshot });

		assert.equal(api.storage()['a.pug'].dependencies.length, 1);
	});

	it('Resolver', () => {
		const api = emitty.setup('fixtures', 'pug', {});
		api.load(snapshot);

		assert.ok(api.resolver.checkDependency('a.pug', 'b.pug'));
		assert.deepEqual(api.resolver.getDependencies('a.pug'), [
			'a.pug',
			'b.pug'
		]);
	});

	it('Scanner', () => {
		const api = emitty.setup('fixtures', 'pug', {});
		return api.scan().then(() => {
			assert.ok(api.resolver.checkDependency('fixtures/pug/nested/nested.pug', 'fixtures/pug/c.pug'));
		});
	});

	it('Stream', (done) => {
		const api = emitty.setup('fixtures', 'pug', {});
		const stream = api.stream('fixtures/pug/c.pug');

		stream.on('data', () => {
			// Because Stream
		});

		stream.on('end', () => {
			assert.equal(api.keys().length, 5);
			done();
		});

		stream.write({ relative: 'a.pug' });

		stream.end();
	});

});