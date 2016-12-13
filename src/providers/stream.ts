'use strict';

import * as fs from 'fs';
import * as through2 from 'through2';
import * as stream from 'stream';
import * as Vinyl from 'vinyl';

import { IOptions } from '../emitty';
import { Storage } from '../services/storage';
import { ILanguage } from '../services/config';
import { Scanner } from '../services/scanner';
import { Resolver } from '../providers/resolver';

import { normalize, join, relative } from '../utils/paths';
import { pathExists, statFile, readFile } from '../utils/fs';

export class Stream {

	constructor(private root: string, private storage: Storage, private language: ILanguage, private options: IOptions) {
		// :)
	}

	public run(filepath?: string, stats?: fs.Stats): stream.Transform {
		const scanner = new Scanner(this.root, this.storage, this.language, this.options);
		const resolver = new Resolver(this.storage);

		const _this = this;

		return through2.obj(function(file, enc, cb) {
			let mainFile = '';
			if (file.path) {
				mainFile = relative(file.cwd, file.path);
			}

			if (!mainFile.startsWith(_this.root)) {
				mainFile = join(_this.root, mainFile);
			}

			// Update Storage
			scanner.scan(filepath, stats).then((lastChangedFile) => {
				// Protection for bad filepath
				if (!filepath && !lastChangedFile) {
					this.push(file);
					return cb();
				}

				filepath = filepath ? filepath : lastChangedFile;
				const changedFile = normalize(filepath);
				if (resolver.checkDependency(mainFile, changedFile)) {
					if (_this.options.makeVinylFile) {
						return _this.makeVinylFile(mainFile).then((vFile) => {
							this.push(vFile);
							_this.options.log(mainFile);
							return cb();
						});
					}

					this.push(file);
					_this.options.log(mainFile);
					return cb();
				}

				cb();
			}).catch(cb);
		});
	}

	private async makeVinylFile(filepath: string): Promise<any> {
		const exists = await pathExists(filepath);
		if (!exists) {
			return null;
		}

		const stat = await statFile(filepath);
		const content = await readFile(filepath);

		return new Vinyl({
			cwd: process.cwd(),
			base: this.root,
			path: filepath,
			contents: new Buffer(content),
			stat
		});
	}

}
