'use strict';

import * as micromatch from 'micromatch';

import { Storage } from '../services/storage';
import { normalize } from '../utils/paths';
import { uniquePrimitiveArray } from '../utils/arrays';

export class Resolver {

	constructor(private storage: Storage) {
		// :)
	}

	/**
	 * Returns all files that depends on the specified file.
	 */
	public getDependencies(filepath: string): string[] {
		filepath = normalize(filepath);
		if (!this.storage.has(filepath)) {
			return [];
		}

		const dependencies = this.traverse(filepath, 1000);
		dependencies.unshift(filepath);

		return uniquePrimitiveArray(dependencies);
	}

	/**
	 * Returns True if A depends on B.
	 */
	public checkDependency(filepath: string, filepathToCheck: string): boolean {
		filepathToCheck = normalize(filepathToCheck);
		return this.getDependencies(filepath).indexOf(filepathToCheck) !== -1;
	}

	private traverse(filepath: string, maxIterations: number): string[] {
		let dependencies: string[] = this.storage.get(filepath).dependencies;

		// Prevent infinite recursion
		maxIterations--;

		for (let i = 0; i < dependencies.length; i++) {
			const matches = micromatch(this.storage.keys(), dependencies[i]);

			for (let j = 0; j < matches.length; j++) {
				const match = matches[j];
				if (match === filepath) {
					continue;
				}

				if (dependencies.indexOf(match) === -1) {
					dependencies.push(match);
				}

				if (this.storage.has(match) && maxIterations > -1) {
					return dependencies.concat(this.traverse(match, maxIterations));
				}
			}
		}

		return dependencies;
	}

}
