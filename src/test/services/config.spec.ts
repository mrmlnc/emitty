'use strict';

import * as assert from 'assert';

import { Config, builtInConfigs } from '../../services/config';

describe('Services/Config', () => {

	let config;

	it('Error by non-exists language', () => {
		try {
			config = new Config('none');
		} catch (err) {
			assert.equal(err, 'Error: the configuration "none" clound not found');
		}
	});

	it('Error by language without extensions and extends', () => {
		try {
			config = new Config({});
		} catch (err) {
			assert.equal(err, 'TypeError: the "extensions" field must be an Array of strings');
		}
	});

	it('Error by language with broken extensions', () => {
		try {
			config = new Config({ extensions: <any>1 });
		} catch (err) {
			assert.equal(err, 'TypeError: the "extensions" field must be an Array of strings');
		}
	});

	it('Error by language with extensions, but without matcher', () => {
		try {
			config = new Config({ extensions: ['.pug'] });
		} catch (err) {
			assert.equal(err, 'TypeError: the "matcher" field must be a RegExp');
		}
	});

	it('Error by language with broken matcher', () => {
		try {
			config = new Config({ extensions: ['.pug'], matcher: <any>1 });
		} catch (err) {
			assert.equal(err, 'TypeError: the "matcher" field must be a RegExp');
		}
	});

	it('Error by language with non-exists extends', () => {
		try {
			config = new Config({ extends: 'nope' });
		} catch (err) {
			assert.equal(err, 'Error: the configuration "nope" clound not found');
		}
	});

	it('Built-in language config', () => {
		config = new Config('jade').getConfig();
		assert.deepEqual(config, builtInConfigs.jade);
	});

	it('Custom language config', () => {
		const customConfig = {
			extensions: ['.hello'],
			matcher: /hello/,
			comments: {
				start: '',
				end: ''
			}
		};

		config = new Config(customConfig).getConfig();
		assert.deepEqual(config, customConfig);
	});

	it('Custom language config with extends', () => {
		const customConfig = {
			extends: 'pug',
			extensions: ['.hello'],
			matcher: /hello/
		};

		config = new Config(customConfig).getConfig();
		assert.deepEqual(config, {
			extensions: ['.hello'],
			matcher: /hello/,
			indentBased: true,
			comments: {
				start: '//',
				end: ''
			}
		});
	});

});
