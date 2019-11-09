import * as assert from 'assert';

import * as fs from '../adapters/fs';
import SettingsService from './settings';

describe('Services → Settings', () => {
	it('should return instance with default values', () => {
		const service = new SettingsService();

		assert.strictEqual(service.cwd, process.cwd());
		assert.deepStrictEqual(service.fs, fs.FILE_SYSTEM_ADAPTER);
	});
});
