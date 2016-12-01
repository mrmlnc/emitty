'use strict';

import * as fs from 'fs';

export function pathExists(filepath: string): Promise<boolean> {
	return new Promise((resolve) => {
		fs.access(filepath, (err) => {
			resolve(!err);
		});
	});
}

export function pathExistsSync(filepath: string): boolean {
	return fs.existsSync(filepath);
}

export function readFile(filepath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, (err, data) => {
			if (err) {
				return reject(err);
			}

			resolve(data.toString());
		});
	});
}

export function statFile(filepath: string): Promise<fs.Stats> {
	return new Promise((resolve, reject) => {
		fs.stat(filepath, (err, stat) => {
			if (err) {
				return reject(err);
			}

			resolve(stat);
		});
	});
}
