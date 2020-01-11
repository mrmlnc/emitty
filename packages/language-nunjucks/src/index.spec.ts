import * as assert from 'assert';

import * as parser from '.';

describe('Language → Nunjucks', () => {
	describe('.parse', () => {
		it('should return a file representation', async () => {
			const buffer = Buffer.from([
				'{% extends "extends.html" %}',
				'{% include "include.html" %}',
				'{# {% extends "extends.html" %} #}',
				'{% import "import.html" as forms %}',
				'{% from "import.html" import field %}'
			].join('\n'));

			const expected: parser.File = {
				references: [
					'extends.html',
					'include.html',
					'import.html',
					'import.html'
				]
			};

			const actual = await parser.parse('home.njk', buffer);

			assert.deepStrictEqual(actual, expected);
		});

		it('should parse nested files usages', async () => {
			const buffer = Buffer.from([
				'{% extends "extends.html" %}',
				'{% block foo %}{% include "include.html" %}{% endblock %}',
				'{# {% extends "extends.html" %} #}',
				'{% import "import.html" as forms %}'
			].join('\n'));

			const expected: parser.File = {
				references: [
					'extends.html',
					'include.html',
					'import.html'
				]
			};

			const actual = await parser.parse('home.njk', buffer);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
