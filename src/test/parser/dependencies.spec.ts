'use strict';

import * as assert from 'assert';
import * as fs from 'fs';

import { Config } from '../../services/config';
import { parseDependencies } from '../../parser/dependencies';

describe('Parser/Dependencies', () => {

	it('Jade', () => {
		const content = fs.readFileSync('./fixtures/jade/parser.jade').toString();
		const config = new Config('jade');
		const dependencies = parseDependencies(content, config.getConfig());

		assert.deepEqual(dependencies, [
			'layouts/default.jade',
			'test-0.jade',
			'test-1.jade',
			'test-2.jade',
			'test-3.jade',
			'test-7.jade',
			'test-9.jade',
			'test-10.jade',
			'test-11.jade',
			'test-12.jade',
			'test-17.jade',
			'script.js',
			'style.css',
			'article.md'
		]);
	});

	it('Pug', () => {
		const content = fs.readFileSync('./fixtures/pug/parser.pug').toString();
		const config = new Config('pug');
		const dependencies = parseDependencies(content, config.getConfig());

		assert.deepEqual(dependencies, [
			'layouts/default.pug',
			'test-0.pug',
			'test-1.pug',
			'test-2.pug',
			'test-3.pug',
			'test-4.pug',
			'test-5.pug',
			'test-6.pug',
			'test-7.pug',
			'test-12.pug',
			'test-13.pug',
			'test-15.pug',
			'test-15.pug',
			'test-18.pug',
			'test-20.pug',
			'test-21.pug',
			'script.js',
			'style.css',
			'article.md'
		]);
	});

	it('Nunjucks', () => {
		const content = fs.readFileSync('./fixtures/nunjucks/parser.njk').toString();
		const config = new Config('nunjucks');
		const dependencies = parseDependencies(content, config.getConfig());

		assert.deepEqual(dependencies, [
			'layouts/default.njk',
			'test-0.njk',
			'test-1.njk',
			'test-2.njk',
			'test-3.njk',
			'test-4.njk',
			'test-7.njk',
			'test-9.njk'
		]);
	});

	it('SugarML', () => {
		const content = fs.readFileSync('./fixtures/sugarml/parser.sgr').toString();
		const config = new Config('sugarml');
		const dependencies = parseDependencies(content, config.getConfig());

		assert.deepEqual(dependencies, [
			'layouts/default.sgr',
			'test-0.sgr',
			'test-1.sgr',
			'test-2.sgr',
			'test-3.sgr',
			'test-7.sgr',
			'test-9.sgr',
			'test-10.sgr',
			'test-11.sgr',
			'test-12.sgr',
			'test-17.sgr',
			'script.js',
			'style.css',
			'article.md'
		]);
	});

	it('PostHTML', () => {
		const content = fs.readFileSync('./fixtures/posthtml/parser.html').toString();
		const config = new Config('posthtml');
		const dependencies = parseDependencies(content, config.getConfig());

		assert.deepEqual(dependencies, [
			'layouts/default.html',
			'test-0.html',
			'test-1.html',
			'test-2.html',
			'test-4.html',
			'test-6.html',
			'test-7.html',
			'test-8.html',
			'test-10.html',
			'test-11.html'
		]);
	});

	it('Less', () => {
		const content = fs.readFileSync('./fixtures/less/parser.less').toString();
		const config = new Config('less');
		const dependencies = parseDependencies(content, config.getConfig());

		assert.deepEqual(dependencies, [
			'test-0.less',
			'test-1.less',
			'test-3.less',
			'test-4.less',
			'test-5.css',
			'test-6.less'
		]);
	});

	it('Stylus', () => {
		const content = fs.readFileSync('./fixtures/stylus/parser.styl').toString();
		const config = new Config('stylus');
		const dependencies = parseDependencies(content, config.getConfig());

		assert.deepEqual(dependencies, [
			'test-0.styl',
			'test-1.styl',
			'test-2.styl',
			'test-3.styl',
			'test-5.styl',
			'test-7.styl'
		]);
	});

	it('Sass', () => {
		const content = fs.readFileSync('./fixtures/sass/parser.sass').toString();
		const config = new Config('sass');
		const dependencies = parseDependencies(content, config.getConfig());

		assert.deepEqual(dependencies, [
			'test-0.sass',
			'test-1.sass',
			'test-2.sass',
			'test-3.sass',
			'test-5.sass',
			'test-7.sass'
		]);
	});

	it('SCSS', () => {
		const content = fs.readFileSync('./fixtures/scss/parser.scss').toString();
		const config = new Config('scss');
		const dependencies = parseDependencies(content, config.getConfig());

		assert.deepEqual(dependencies, [
			'test-0.scss',
			'test-1.scss',
			'test-2.scss',
			'test-3.scss',
			'test-5.scss',
			'test-6.scss',
			'test-7.scss'
		]);
	});

});
