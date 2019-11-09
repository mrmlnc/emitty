import * as path from 'path';

import SettingsService, { Options } from './settings';
import StorageService from './storage';

export type Snapshot = {
	version: number;
	options: Options;
	references: SnapshotReferences;
};

export type SnapshotReferences = Record<string, string[]>;

export default class SnapshotService {
	constructor(
		private readonly _settings: SettingsService,
		private readonly _storage: StorageService
	) { }

	public load(snapshot: Snapshot): void {
		if (!this._isReusableSnapshot(snapshot)) {
			return;
		}

		for (const key of Object.keys(snapshot.references)) {
			this._storage.set(this._resolvePath(key), {
				references: snapshot.references[key].map(this._resolvePath, this)
			});
		}
	}

	public dump(): Snapshot {
		const references = this._storage.keys().reduce((collection, key) => {
			const value = this._storage.get(key);

			if (value !== undefined) {
				collection[this._relativePath(key)] = value.references.map(this._relativePath, this);
			}

			return collection;
		}, {} as unknown as SnapshotReferences);

		return {
			version: this._settings.version,
			options: this._settings.options,
			references
		};
	}

	private _isReusableSnapshot(snapshot: Snapshot): boolean {
		return this._isSupportedVersion(snapshot) && this._isSameOptions(snapshot.options, this._settings.options);
	}

	private _isSupportedVersion(snapshot: Snapshot): boolean {
		return snapshot.version === this._settings.version;
	}

	private _isSameOptions(previous: Options, current: Options): boolean {
		const keys = Object.keys(current) as Array<keyof Options>;

		for (const key of keys) {
			if (previous[key] !== current[key]) {
				return false;
			}
		}

		return true;
	}

	private _relativePath(filepath: string): string {
		return this._normalizePath(path.relative(this._settings.cwd, filepath));
	}

	private _resolvePath(filepath: string): string {
		return path.join(this._settings.cwd, filepath);
	}

	private _normalizePath(filepath: string): string {
		return filepath.replace(/\\/g, '/');
	}
}
