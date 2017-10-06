'use strict';

import * as assert from 'assert';

import { ConfigService, builtInConfigs } from '../../services/config';

describe('Services/Config', () => {

	let config;

	it('Error by non-exists language', () => {
		try {
			config = new ConfigService('none');
		} catch (err) {
			assert.equal(err, 'Error: the configuration "none" clound not found');
		}
	});

	it('Error by language without extensions and extends', () => {
		try {
			config = new ConfigService({});
		} catch (err) {
			assert.equal(err, 'TypeError: the "extensions" field must be an Array of strings');
		}
	});

	it('Error by language with broken extensions', () => {
		try {
			config = new ConfigService({ extensions: <any>1 });
		} catch (err) {
			assert.equal(err, 'TypeError: the "extensions" field must be an Array of strings');
		}
	});

	it('Error by language with extensions, but without matcher', () => {
		try {
			config = new ConfigService({ extensions: ['.pug'] });
		} catch (err) {
			assert.equal(err, 'TypeError: the "matcher" field must be a RegExp');
		}
	});

	it('Error by language with broken matcher', () => {
		try {
			config = new ConfigService({ extensions: ['.pug'], matcher: <any>1 });
		} catch (err) {
			assert.equal(err, 'TypeError: the "matcher" field must be a RegExp');
		}
	});

	it('Error by language with non-exists extends', () => {
		try {
			config = new ConfigService({ extends: 'nope' });
		} catch (err) {
			assert.equal(err, 'Error: the configuration "nope" clound not found');
		}
	});

	it('Built-in language config', () => {
		config = new ConfigService('jade').getConfig();
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

		config = new ConfigService(customConfig).getConfig();
		assert.deepEqual(config, customConfig);
	});

	it('Custom language config with extends', () => {
		const customConfig = {
			extends: 'pug',
			extensions: ['.hello'],
			matcher: /hello/
		};

		config = new ConfigService(customConfig).getConfig();
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
