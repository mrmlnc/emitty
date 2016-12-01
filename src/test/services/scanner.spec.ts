'use strict';

import * as assert from 'assert';

import { Storage } from '../../services/storage';
import { Config } from '../../services/config';
import { Scanner } from '../../services/scanner';

const storage = new Storage();
const config = new Config('pug');
const options = {
	scanner: {
		depth: 30,
		exclude: ['.git', '**/node_modules', '**/bower_components']
	}
};
const scanner = new Scanner('fixtures', storage, config.getConfig(), options);

describe('Services/Scanner', () => {

	it('Scan directory', () => {
		return scanner.scan().then(() => {
			assert.equal(storage.keys().length, 5);

			assert.ok(storage.keys().indexOf('fixtures/pug/parser.pug') !== -1);
			assert.deepEqual(storage.get('fixtures/pug/a.pug').dependencies, [
				'fixtures/pug/b.pug',
				'fixtures/pug/c.pug'
			]);
		});
	});

	it('Scan File', () => {
		storage.drop('fixtures/pug/parser.pug');
		return scanner.scan('fixtures/pug/parser.pug').then(() => {
			assert.equal(storage.keys().length, 5);
			assert.ok(storage.keys().indexOf('fixtures/pug/parser.pug') !== -1);
		});
	});

});
