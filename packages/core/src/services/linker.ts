import StorageService from './storage';

export default class LinkerService {
	constructor(private readonly _storage: StorageService) { }

	public getAllReferences(source: string): string[] {
		const iterator = new Set([source]);

		for (const filepath of iterator) {
			const item = this._storage.get(filepath);

			if (item === undefined) {
				continue;
			}

			for (const reference of item.references) {
				iterator.add(reference);
			}
		}

		return [...iterator];
	}
}
