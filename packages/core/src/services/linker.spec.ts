import * as assert from 'assert';

import LinkerService from './linker';
import StorageService from './storage';

describe('Services → Linker', () => {
	describe('.getAllReferences', () => {
		it('should return the same path for non-exist path', () => {
			const storage = new StorageService();
			const linker = new LinkerService(storage);

			const expected = [
				'non-exist-file.pug'
			];

			const actual = linker.getAllReferences('non-exist-file.pug');

			assert.deepStrictEqual(actual, expected);
		});

		it('should return all references', () => {
			const storage = new StorageService();
			const linker = new LinkerService(storage);

			storage.set('./home.pug', {
				references: ['./components/header.pug']
			});

			storage.set('./components/header.pug', {
				references: []
			});

			const expected = [
				'./home.pug',
				'./components/header.pug'
			];

			const actual = linker.getAllReferences('./home.pug');

			assert.deepStrictEqual(actual, expected);
		});
	});
});
