'use strict';

import * as assert from 'assert';

import { join, normalize, relative, expandGlobPatterns } from '../../utils/paths';

describe('Utils/Paths', () => {

	it('join', () => {
		assert.equal(join('a\\b', 'c.txt'), 'a/b/c.txt');
	});

	it('normalize', () => {
		assert.equal(normalize('a\\b\\c.txt'), 'a/b/c.txt');
	});

	it('relative', () => {
		assert.equal(relative('a', 'a\\b\\c.txt'), 'b/c.txt');
	});

	it('expandGlobPatterns', () => {
		assert.deepEqual(expandGlobPatterns(['.git', '**/node_modules']), [
			'.git',
			'**/node_modules',
			'**/node_modules/**'
		]);
	});

});
