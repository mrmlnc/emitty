'use strict';

import * as fs from 'fs';
import * as through2 from 'through2';
import * as stream from 'stream';

import { IOptions } from '../emitty';
import { Storage } from '../services/storage';
import { ILanguage } from '../services/config';
import { Scanner } from '../services/scanner';
import { Resolver } from '../providers/resolver';

import { normalize } from '../utils/paths';

export class Stream {

	constructor(private storage: Storage, private options: IOptions, private language: ILanguage, private root: string) {
		// :)
	}

	public run(filepath: string, stat?: fs.Stats): stream.Transform {
		const scanner = new Scanner(this.root, this.storage, this.language, this.options);
		const resolver = new Resolver(this.storage);

		const log = this.options.log;

		return through2.obj(function(file, enc, cb) {
			// Protection for bad filepath
			if (!filepath) {
				this.push(file);
				return cb();
			}

			filepath = normalize(filepath);

			// Update Storage
			scanner.scan(filepath, stat).then(() => {
				if (resolver.checkDependency(file.path, filepath)) {
					this.push(file);
					log(file.path);
					return cb();
				}

				cb();
			}).catch(cb);
		});
	}

}
