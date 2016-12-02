'use strict';

import * as fs from 'fs';
import * as stream from 'stream';

import { IStorage, Storage } from './services/storage';
import { ILanguage, Config } from './services/config';
import { Scanner } from './services/scanner';
import { Resolver } from './providers/resolver';
import { Stream } from './providers/stream';

import { pathExistsSync } from './utils/fs';

export interface IScannerOptions {
	depth?: number;
	exclude?: string[];
}

export interface IOptions {
	snapshot?: IStorage;
	log?: (filepath: string) => void;
	scanner?: IScannerOptions;
}

function assertInput(directory: string, language: string | ILanguage): void {
	if (!directory) {
		throw new TypeError('directory must be a string');
	}

	const type = typeof language;
	if (!language || (type !== 'string' && type !== 'object')) {
		throw new TypeError('language must be a string or an object');
	}
	if (!pathExistsSync(directory)) {
		throw new Error('directory must exist');
	}
}

export default function emitty(directory: string, language: string | ILanguage, options?: IOptions) {
	assertInput(directory, language);

	const storage = new Storage();

	options = Object.assign(<IOptions>{
		snapshot: {},
		log: (filepath: string) => console.log
	}, options);

	options.scanner = Object.assign(<IScannerOptions>{
		depth: 30,
		exclude: ['.git', '**/node_modules', '**/bower_components']
	}, options.scanner);

	// Loading data if provided dependency tree
	if (options.snapshot) {
		storage.load(options.snapshot);
	}

	const config = new Config(language);
	const scanner = new Scanner(directory, storage, config.getConfig(), options);
	const resolver = new Resolver(storage);
	const stream = new Stream(storage, options, config.getConfig(), directory);

	return {
		storage: () => storage.snapshot(),
		keys: () => storage.keys(),
		load: (snapshot: IStorage) => storage.load(snapshot),
		scan: (filepath?: string, stat?: fs.Stats) => scanner.scan(filepath, stat),
		resolver,
		stream: (filepath: string, stat?: fs.Stats): stream.Transform => stream.run(filepath, stat)
	};
}
