import * as fs from '../adapters/fs';

export type Options = {
	/**
	 * Custom implementation of methods for working with the file system.
	 *
	 * @default fs.*
	 */
	fs?: Partial<fs.FileSystemAdapter>;

	/**
	 * The current working directory in which to search.
	 *
	 * @default process.cwd()
	 */
	cwd?: string;
};

export default class SettingsService {
	public readonly version: number = 2;
	public readonly options: Options = this._options;
	public readonly cwd: string = this._getValue(this._options.cwd, process.cwd());
	public readonly fs: fs.FileSystemAdapter = fs.createFileSystemAdapter(this._options.fs);

	constructor(private readonly _options: Options = {}) { }

	private _getValue<T>(option: T | undefined, value: T): T {
		return option === undefined ? value : option;
	}
}
