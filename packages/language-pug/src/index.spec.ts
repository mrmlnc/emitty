import * as assert from 'assert';

import * as parser from '.';

describe('Language → Pug', () => {
	describe('.parse', () => {
		it('should return a file representation', async () => {
			const buffer = Buffer.from([
				'extends file-0',
				'include file-1',
				'// include file-2'
			].join('\n'));

			const expected: parser.File = {
				references: [
					'file-0',
					'file-1'
				]
			};

			const actual = await parser.parse('home.pug', buffer);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
