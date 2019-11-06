import * as assert from 'assert';

import StorageService from './storage';

describe('Services → Storage', () => {
	describe('.set & .get', () => {
		const service = new StorageService();

		service.set('key', {
			references: []
		});

		const expected = {
			references: []
		};

		const actual = service.get('key');

		assert.deepStrictEqual(actual, expected);
	});

	describe('.delete', () => {
		const service = new StorageService();

		service.set('key', {
			references: []
		});

		service.delete('key');

		const actual = service.get('key');

		assert.strictEqual(actual, undefined);
	});

	describe('.clear', () => {
		const service = new StorageService();

		service.set('key', {
			references: []
		});

		service.clear();

		const actual = service.get('key');

		assert.strictEqual(actual, undefined);
	});
});
