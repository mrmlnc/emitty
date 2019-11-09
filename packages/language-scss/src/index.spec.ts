import * as assert from 'assert';

import * as parser from '.';

describe('Language → SCSS', () => {
	describe('.parse', () => {
		it('should return a file representation', async () => {
			const buffer = Buffer.from([
				'@import "import";',
				'@import "import2.scss";',
				'// @import "import.scss";'
			].join('\n'));

			const expected: parser.File = {
				references: [
					'import.sass',
					'import.scss',
					'import/_index.sass',
					'import/_index.scss',
					'_import.sass',
					'_import.scss',
					'import2.scss',
					'_import2.scss'
				]
			};

			const actual = await parser.parse('styles.scss', buffer);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
