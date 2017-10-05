'use strict';

import * as path from 'path';
import * as fs from 'fs';
import * as through2 from 'through2';
import * as stream from 'stream';
import * as Vinyl from 'vinyl';

import { IOptions } from '../emitty';
import { StorageService } from '../services/storage';
import { ILanguage } from '../services/config';
import { ScannerService } from '../services/scanner';
import { ResolverProvider } from '../providers/resolver';

import * as pathUtils from '../utils/paths';
import * as fsUtils from '../utils/fs';

export class StreamProvider {

	private readonly scanner: ScannerService;
	private readonly resolver: ResolverProvider;

	constructor(private root: string, private storage: StorageService, private language: ILanguage, private options: IOptions) {
		this.scanner = new ScannerService(this.root, this.storage, this.language, this.options);
		this.resolver = new ResolverProvider(this.storage);
	}

	/**
	 * Starts scanning the directory and push Vinyl file to a Stream if it is required.
	 */
	public run(filepath?: string, stats?: fs.Stats): stream.Transform {
		const self = this;

		// Protection against undefined
		if (typeof filepath !== 'string') {
			filepath = null;
			stats = null;
		}

		// Protection against WIN32 paths
		filepath = pathUtils.normalize(filepath);

		return through2.obj(function (file, _enc, cb) {
			const mainFile = self.makeMainFilePath(self.root, file);

			// Update Storage
			self.scanner.scan(filepath, stats).then((lastChangedFile) => {
				// Protection against bad paths
				if (!filepath && !lastChangedFile) {
					self.pushFile(this, file, mainFile);
					return cb();
				}

				filepath = filepath ? filepath : lastChangedFile;
				self.filterFileByDependencies(filepath, mainFile, this, file, cb);
			}).catch(cb);
		});
	}

	/**
	 * Push Vinyl file to a Stream if it is required.
	 */
	public filter(filepath: string): stream.Transform {
		const self = this;

		return through2.obj(function (file, _enc, cb) {
			const mainFile = self.makeMainFilePath(self.root, file);

			// Protection against bad paths
			if (!filepath) {
				self.pushFile(this, file, mainFile);
				return cb();
			}

			self.filterFileByDependencies(filepath, mainFile, this, file, cb);
		});
	}

	/**
	 * Determines whether to send the Vinyl file to a Stream.
	 */
	private filterFileByDependencies(filepath: string, mainFile: string, streamCtx: any, file: Vinyl, cb: Function) {
		const changedFile = pathUtils.normalize(filepath);
		if (this.resolver.checkDependency(mainFile, changedFile)) {
			if (this.options.makeVinylFile) {
				return this.makeVinylFile(mainFile).then((vFile) => {
					this.pushFile(streamCtx, vFile, mainFile);
					return cb();
				});
			}

			this.pushFile(streamCtx, file, mainFile);
			return cb();
		}

		return cb();
	}

	/**
	 * Push Vinyl file to a Stream.
	 */
	private pushFile(ctx: any, file: Vinyl, filepath: string) {
		ctx.push(file);
		this.options.log(filepath);
	}

	/**
	 * Calculates relative path of the Vinyl file in Stream.
	 */
	private makeMainFilePath(root: string, file: Vinyl) {
		let filepath = '';
		if (file.path) {
			filepath = pathUtils.relative(file.cwd, file.path);
		}

		if (!filepath.startsWith(root)) {
			filepath = pathUtils.join(root, filepath);
		}

		return pathUtils.normalize(filepath);
	}

	/**
	 * Creates Vinyl File for filepath.
	 */
	private async makeVinylFile(filepath: string): Promise<any> {
		const exists = await fsUtils.pathExists(filepath);
		if (!exists) {
			return null;
		}

		const stat = await fsUtils.statFile(filepath);
		const content = await fsUtils.readFile(filepath);

		const fullpath = pathUtils.join(process.cwd(), filepath);

		return new Vinyl({
			base: path.dirname(fullpath),
			path: fullpath,
			contents: new Buffer(content),
			stat
		});
	}

}
