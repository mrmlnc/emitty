import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

import * as sinon from 'sinon';

import SettingsService from './settings';
import StorageService from './storage';
import ResolverService from './resolver';
import LanguageService from './language';

describe('Services → Resolver', () => {
	describe('.resolve', () => {
		it('should delete non-exist file', async () => {
			const fsAccess = sinon.stub();

			const settings = new SettingsService({
				fs: { access: fsAccess as unknown as typeof fs.access }
			});

			const storage = new StorageService();
			const language = new LanguageService();
			const resolver = new ResolverService(settings, language, storage);

			const fullPath = path.resolve('./home.pug');

			storage.set(fullPath, { references: [] });
			fsAccess.yields(new Error('non-exist'));

			await resolver.resolve(fullPath);

			const actual = storage.get(fullPath);

			assert.strictEqual(actual, undefined);
		});

		it('should update exist storage item', async () => {
			const fsAccess = sinon.stub();
			const fsReadFile = sinon.stub();
			const parser = sinon.stub().resolves({
				references: ['header.pug']
			});

			const settings = new SettingsService({
				fs: {
					access: fsAccess as unknown as typeof fs.access,
					readFile: fsReadFile as unknown as typeof fs.readFile
				}
			});

			const storage = new StorageService();
			const language = new LanguageService();
			const resolver = new ResolverService(settings, language, storage);

			const homeFullPath = path.resolve('./home.pug');
			const headerFullPath = path.resolve('./header.pug');

			language.set('.pug', {
				extensions: ['.pug', '.jade'],
				parser
			});
			storage.set(homeFullPath, { references: [] });
			fsAccess.yields(null);
			fsReadFile.yields(null, Buffer.from('include header.pug'));

			await resolver.resolve(homeFullPath);

			const expected = {
				references: [headerFullPath]
			};

			const actual = storage.get(homeFullPath);

			sinon.assert.calledOnce(fsAccess);
			sinon.assert.calledOnce(fsReadFile);
			sinon.assert.calledOnce(parser);

			assert.deepStrictEqual(actual, expected);
		});

		it('should apply extensions to references', async () => {
			const fsAccess = sinon.stub();
			const fsReadFile = sinon.stub();

			const settings = new SettingsService({
				fs: {
					access: fsAccess as unknown as typeof fs.access,
					readFile: fsReadFile as unknown as typeof fs.readFile
				}
			});

			const storage = new StorageService();
			const language = new LanguageService();
			const resolver = new ResolverService(settings, language, storage);

			const homeFullPath = path.resolve('./home.pug');

			language.set('.pug', {
				extensions: ['.pug', '.jade'],
				parser: () => Promise.resolve({
					references: ['header']
				})
			});
			fsAccess.yields(null);
			fsReadFile.yields(null, Buffer.from('include header'));

			await resolver.resolve(homeFullPath);

			const expected = {
				references: [
					path.resolve('./header.pug'),
					path.resolve('./header.jade')
				]
			};

			const actual = storage.get(homeFullPath);

			assert.deepStrictEqual(actual, expected);
		});

		it('should traverse references in "recursive" mode', async () => {
			const fsAccess = sinon.stub();
			const fsReadFile = sinon.stub();
			const parser = sinon.stub();

			const settings = new SettingsService({
				fs: {
					access: fsAccess as unknown as typeof fs.access,
					readFile: fsReadFile as unknown as typeof fs.readFile
				}
			});

			const storage = new StorageService();
			const language = new LanguageService();
			const resolver = new ResolverService(settings, language, storage);

			const homeFullPath = path.resolve('./home.pug');
			const headerFullPath = path.resolve('./header.pug');

			language.set('.pug', {
				extensions: ['.pug', '.jade'],
				parser
			});

			fsAccess.yields(null);
			fsReadFile.onFirstCall().yields(null, Buffer.from('include header.pug'));
			fsReadFile.onSecondCall().yields(null, Buffer.from(''));

			parser.onFirstCall().resolves({ references: ['header.pug'] });
			parser.onSecondCall().resolves({ references: [] });

			await resolver.resolve(homeFullPath, /* recursive */ true);

			assert.deepStrictEqual(storage.get(homeFullPath), {
				references: [headerFullPath]
			});

			assert.deepStrictEqual(storage.get(headerFullPath), {
				references: []
			});
		});
	});
});
