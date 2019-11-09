import LanguageService from './language';
import LinkerService from './linker';
import ResolverService from './resolver';
import SettingsService from './settings';
import StorageService from './storage';
import SnapshotService from './snapshot';

export type ServiceStore = {
	language: LanguageService;
	linker: LinkerService;
	resolver: ResolverService;
	settings: SettingsService;
	snapshot: SnapshotService;
	storage: StorageService;
};

export default class ContainerService {
	constructor(private readonly _services: ServiceStore) { }

	public get language(): LanguageService {
		return this._services.language;
	}

	public get linker(): LinkerService {
		return this._services.linker;
	}

	public get resolver(): ResolverService {
		return this._services.resolver;
	}

	public get settings(): SettingsService {
		return this._services.settings;
	}

	public get snapshot(): SnapshotService {
		return this._services.snapshot;
	}

	public get storage(): StorageService {
		return this._services.storage;
	}
}
