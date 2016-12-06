'use strict';

export interface IStorageItem {
	dependencies: string[];
	ctime: number;
}

export interface IStorage {
	[uri: string]: IStorageItem;
}

export class Storage {

	private store: IStorage = {};

	constructor() {
		// :)
	}

	public load(snapshot: IStorage): void {
		this.store = {};

		Object.keys(snapshot).forEach((uri) => {
			this.set(uri, snapshot[uri]);
		});
	}

	public has(uri: string): boolean {
		return this.store.hasOwnProperty(uri);
	}

	public get(uri: string): IStorageItem {
		return this.store[uri] || null;
	}

	public set(uri: string, item: IStorageItem): void {
		this.store[uri] = item;
	}

	public drop(uri: string): void {
		delete this.store[uri];
	}

	public keys(): string[] {
		return Object.keys(this.store);
	}

	public snapshot() {
		return this.store;
	}

}
