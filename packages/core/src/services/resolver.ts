import * as path from 'path';

import StorageService from './storage';
import SettingsService from './settings';
import LanguageService, { Language } from './language';

export default class ResolverService {
	constructor(
		private readonly _settings: SettingsService,
		private readonly _language: LanguageService,
		private readonly _storage: StorageService
	) { }

	public async resolve(source: string, recursive: boolean = false): Promise<void> {
		const iterator = new Set([source]);

		for (const filepath of iterator.values()) {
			// eslint-disable-next-line no-await-in-loop
			const isExist = await this._isExistFile(filepath);

			if (!isExist) {
				this._storage.delete(filepath);

				continue;
			}

			// eslint-disable-next-line no-await-in-loop
			const buffer = await this._readFile(filepath);
			const language = this._getLanguage(filepath);

			if (language === undefined) {
				continue;
			}

			// eslint-disable-next-line no-await-in-loop
			const parsedFile = await language.parser(filepath, buffer);

			parsedFile.references = this._applyExtensionsToReferences(filepath, parsedFile.references, language.extensions);

			this._storage.set(filepath, parsedFile);

			if (!recursive) {
				continue;
			}

			for (const reference of parsedFile.references) {
				iterator.add(reference);
			}
		}
	}

	private _isExistFile(filepath: string): Promise<boolean> {
		return new Promise((resolve) => {
			this._settings.fs.access(filepath, this._settings.fs.constants.F_OK, (error) => {
				return resolve(error === null);
			});
		});
	}

	private _readFile(filepath: string): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			this._settings.fs.readFile(filepath, (error, buffer) => {
				return error === null ? resolve(buffer) : reject(error);
			});
		});
	}

	private _getLanguage(filepath: string): Language | undefined {
		const extension = path.extname(filepath);

		return this._language.get(extension);
	}

	private _hasExtension(filepath: string): boolean {
		return path.extname(filepath) !== '';
	}

	private _applyExtensionsToReferences(source: string, references: string[], extensions: string[]): string[] {
		return references.reduce((collection, reference) => {
			const fullPath = path.join(source, '..', reference);

			if (this._hasExtension(fullPath)) {
				collection.push(fullPath);
			} else {
				for (const extension of extensions) {
					collection.push(`${fullPath}${extension}`);
				}
			}

			return collection;
		}, [] as string[]);
	}
}
