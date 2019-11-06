import * as assert from 'assert';
import * as fs from 'fs';

import * as sinon from 'sinon';

import * as adapter from './fs';

describe('Adapters → FileSystem', () => {
	it('should return original FS methods', () => {
		const expected: adapter.FileSystemAdapter = adapter.FILE_SYSTEM_ADAPTER;

		const actual = adapter.createFileSystemAdapter();

		assert.deepStrictEqual(actual, expected);
	});

	it('should return custom FS methods', () => {
		const constants = sinon.stub(fs.constants);

		const expected: adapter.FileSystemAdapter = {
			...adapter.FILE_SYSTEM_ADAPTER,
			constants
		};

		const actual = adapter.createFileSystemAdapter({
			constants
		});

		assert.deepStrictEqual(actual, expected);
	});
});
