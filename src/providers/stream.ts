'use strict';

import * as fs from 'fs';
import * as through2 from 'through2';
import * as stream from 'stream';

import { IOptions } from '../emitty';
import { Storage } from '../services/storage';
import { ILanguage } from '../services/config';
import { Scanner } from '../services/scanner';
import { Resolver } from '../providers/resolver';

import { normalize, join } from '../utils/paths';

export class Stream {

	constructor(private root: string, private storage: Storage, private language: ILanguage, private options: IOptions) {
		// :)
	}

	public run(filepath?: string, stats?: fs.Stats): stream.Transform {
		const scanner = new Scanner(this.root, this.storage, this.language, this.options);
		const resolver = new Resolver(this.storage);

		const root = this.root;
		const log = this.options.log;

		return through2.obj(function(file, enc, cb) {
			const mainFile = join(root, file.relative);

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
					this.push(file);
					log(mainFile);
					return cb();
				}

				cb();
			}).catch(cb);
		});
	}

}
