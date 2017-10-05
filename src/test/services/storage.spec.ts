'use strict';

import * as assert from 'assert';

import { StorageService } from '../../services/storage';

const storage = new StorageService();

describe('Services/Storage', () => {

	it('Set/Get', () => {
		storage.set('a.pug', {
			dependencies: ['b.pug'],
			ctime: Date.now()
		});

		assert.equal(storage.get('a.pug').dependencies.length, 1);
	});

	it('Has', () => {
		assert.ok(storage.has('a.pug'));
		assert.ok(!storage.has('b.pug'));
	});

	it('Drop', () => {
		storage.drop('a.pug');

		assert.ok(!storage.has('a.pug'));
	});

	it('Load', () => {
		storage.load({
			'b.pug': {
				dependencies: ['c.pug'],
				ctime: Date.now()
			}
		});

		assert.ok(!storage.has('a.pug'));
		assert.ok(storage.has('b.pug'));
	});

	it('Keys', () => {
		assert.deepEqual(storage.keys(), ['b.pug']);
	});

	it('Storage', () => {
		assert.deepEqual(storage.snapshot()['b.pug'].dependencies, ['c.pug']);
	});

});
