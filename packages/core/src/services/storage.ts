export type StorageItem = {
	references: string[];
};

export default class StorageService {
	private readonly _storage: Map<string, StorageItem> = new Map();

	public get(key: string): StorageItem | undefined {
		return this._storage.get(key);
	}

	public set(key: string, item: StorageItem): void {
		this._storage.set(key, item);
	}

	public delete(key: string): void {
		this._storage.delete(key);
	}

	public clear(): void {
		this._storage.clear();
	}

	public keys(): string[] {
		const keys: string[] = [];

		for (const key of this._storage.keys()) {
			keys.push(key);
		}

		return keys;
	}
}
