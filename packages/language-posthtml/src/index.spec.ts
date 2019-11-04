import * as assert from 'assert';

import * as parser from '.';

describe('Language → PostHTML', () => {
	describe('.parse', () => {
		it('should return a file representation', async () => {
			const buffer = Buffer.from([
				'<module href="module.html"></module>',
				'<include src="include.html"></include>',
				'<!--<extends src="extends.html"></extends>-->',
				'<extends src="extends.html"></extends>'
			].join('\n'));

			const expected: parser.File = {
				references: [
					'module.html',
					'include.html',
					'extends.html'
				]
			};

			const actual = await parser.parse('home.html', buffer);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
