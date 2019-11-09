import * as assert from 'assert';

import * as parser from '.';

describe('Language → Less', () => {
	describe('.parse', () => {
		it('should return a file representation', async () => {
			const buffer = Buffer.from([
				'@import "import.less"',
				'// @import "import.less"'
			].join('\n'));

			const expected: parser.File = {
				references: [
					'import.less'
				]
			};

			const actual = await parser.parse('styles.less', buffer);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
