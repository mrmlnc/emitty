'use strict';

import * as assert from 'assert';

import { Storage } from '../../services/storage';
import { Resolver } from '../../providers/resolver';

const storage = new Storage();
const resolver = new Resolver(storage);

describe('Providers/Resolver', () => {

	before(() => {
		storage.load({
			'pug/a.pug': {
				dependencies: ['pug/*.pug'],
				ctime: new Date()
			},
			'pug/b.pug': {
				dependencies: ['pug/nested/c.pug'],
				ctime: new Date()
			},
			'pug/nested/c.pug': {
				dependencies: ['pug/nested/d.pug'],
				ctime: new Date()
			},
			'pug/nested/d.pug': {
				dependencies: [],
				ctime: new Date()
			}
		});
	});

	it('The list of dependencies for an existing item', () => {
		assert.deepEqual(resolver.getDependencies('pug/a.pug'), [
			'pug/a.pug',
			'pug/*.pug',
			'pug/b.pug',
			'pug/nested/c.pug',
			'pug/nested/d.pug'
		]);
	});

	it('The list of dependencies for a non-existing item', () => {
		assert.deepEqual(resolver.getDependencies('none.pug'), ['none.pug']);
	});

	it('Check filepath as dependency', () => {
		assert.equal(resolver.checkDependency('pug/a.pug', 'pug/nested/d.pug'), true);
		assert.equal(resolver.checkDependency('pug/a.pug', 'pug/e.pug'), false);
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
