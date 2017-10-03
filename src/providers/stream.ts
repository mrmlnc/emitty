'use strict';

import * as path from 'path';
import * as fs from 'fs';
import * as through2 from 'through2';
import * as stream from 'stream';
import * as Vinyl from 'vinyl';

import { IOptions } from '../emitty';
import { Storage } from '../services/storage';
import { ILanguage } from '../services/config';
import { Scanner } from '../services/scanner';
import { Resolver } from '../providers/resolver';

import { normalize } from '../utils/paths';
import { pathExists, statFile, readFile } from '../utils/fs';

export class Stream {

	private readonly scanner: Scanner;
	private readonly resolver: Resolver;

	constructor(private root: string, private storage: Storage, private language: ILanguage, private options: IOptions) {
		this.scanner = new Scanner(this.root, this.storage, this.language, this.options);
		this.resolver = new Resolver(this.storage);
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
		const changedFile = normalize(filepath);
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
			filepath = path.relative(file.cwd, file.path);
		}

		if (!filepath.startsWith(root)) {
			filepath = path.join(root, filepath);
		}

		return normalize(filepath);
	}

	/**
	 * Creates Vinyl File for filepath.
	 */
	private async makeVinylFile(filepath: string): Promise<any> {
		const exists = await pathExists(filepath);
		if (!exists) {
			return null;
		}

		const stat = await statFile(filepath);
		const content = await readFile(filepath);

		const fullpath = path.join(process.cwd(), filepath);

		return new Vinyl({
			base: path.dirname(fullpath),
			path: fullpath,
			contents: new Buffer(content),
			stat
		});
	}

}
