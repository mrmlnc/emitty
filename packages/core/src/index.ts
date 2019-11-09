import * as path from 'path';

import SettingsService, { Options } from './services/settings';
import LanguageService, { Language, LanguageParserFunction, LanguageFile } from './services/language';
import StorageService from './services/storage';
import LinkerService from './services/linker';
import ResolverService from './services/resolver';
import ContainerService from './services/container';
import SnapshotService, { Snapshot, SnapshotReferences } from './services/snapshot';

export default class Emitty {
	constructor(private readonly _container: ContainerService) { }

	public language(language: Language): void {
		for (const extension of language.extensions) {
			this._container.language.set(extension, language);
		}
	}

	public load(snapshot: Snapshot): void {
		this._container.snapshot.load(snapshot);
	}

	public dump(): Snapshot {
		return this._container.snapshot.dump();
	}

	public clear(): void {
		this._container.storage.clear();
	}

	public async filter(source: string, changed?: string): Promise<boolean> {
		const sourceFullPath = path.resolve(this._container.settings.cwd, source);

		if (changed === undefined) {
			await this._container.resolver.resolve(sourceFullPath, /* recursive */ true);

			return true;
		}

		const changedFullPath = path.resolve(this._container.settings.cwd, changed);

		await this._container.resolver.resolve(changedFullPath);

		const references = this._container.linker.getAllReferences(sourceFullPath);

		return references.includes(changedFullPath);
	}
}

export function configure(options: Options = {}): Emitty {
	const language = new LanguageService();
	const storage = new StorageService();
	const linker = new LinkerService(storage);
	const settings = new SettingsService(options);
	const snapshot = new SnapshotService(settings, storage);
	const resolver = new ResolverService(settings, language, storage);

	const container = new ContainerService({
		language,
		linker,
		resolver,
		settings,
		snapshot,
		storage
	});

	return new Emitty(container);
}

export {
	Options,
	Language,
	LanguageFile,
	LanguageParserFunction,
	Snapshot,
	SnapshotReferences
};
