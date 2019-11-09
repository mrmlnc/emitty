import * as assert from 'assert';

import * as sinon from 'sinon';

import LanguageService, { Language } from './language';

describe('Services → Language', () => {
	describe('.set & .get', () => {
		const service = new LanguageService();

		const language: Language = {
			extensions: ['.pug'],
			parser: sinon.stub()
		};

		service.set('.pug', language);

		const actual = service.get('.pug');

		assert.deepStrictEqual(actual, language);
	});
});
