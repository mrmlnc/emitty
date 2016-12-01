'use strict';

import * as assert from 'assert';

import { Storage } from '../../services/storage';
import { Resolver } from '../../providers/resolver';

const storage = new Storage();
const resolver = new Resolver(storage);

describe('Providers/Resolver', () => {

	before(() => {
		storage.load({
			'a.pug': {
				dependencies: ['**/*.pug'],
				ctime: new Date()
			},
			'b.pug': {
				dependencies: ['c.pug'],
				ctime: new Date()
			},
			'c.pug': {
				dependencies: ['d.pug'],
				ctime: new Date()
			},
			'd.pug': {
				dependencies: [],
				ctime: new Date()
			}
		});
	});

	it('The list of dependencies for an existing item', () => {
		assert.deepEqual(resolver.getDependencies('a.pug'), [
			'a.pug',
			'**/*.pug',
			'b.pug',
			'c.pug',
			'd.pug'
		]);
	});

	it('The list of dependencies for a non-existing item', () => {
		assert.deepEqual(resolver.getDependencies('none.pug'), []);
	});

	it('Check filepath as dependency', () => {
		assert.equal(resolver.checkDependency('a.pug', 'c.pug'), true);
		assert.equal(resolver.checkDependency('a.pug', 'e.pug'), false);
	});

	it('Prevent infinity recursion', () => {
		storage.load({
			'a.pug': {
				dependencies: ['b.pug'],
				ctime: new Date()
			},
			'b.pug': {
				dependencies: ['a.pug'],
				ctime: new Date()
			}
		});

		assert.deepEqual(resolver.getDependencies('a.pug'), [
			'a.pug',
			'b.pug'
		]);
	});

});
