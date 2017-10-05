'use strict';

import * as micromatch from 'micromatch';

import { StorageService } from '../services/storage';
import * as pathUtils from '../utils/paths';

export class Resolver {

	constructor(private storage: StorageService) {
		// :)
	}

	/**
	 * Returns all files that depends on the specified file.
	 */
	public getDependencies(filepath: string): string[] {
		filepath = pathUtils.normalize(filepath);
		if (!this.storage.has(filepath)) {
			return [filepath];
		}

		const dependencies = this.traverse(filepath, this.storage.keys(), [], 1000);
		dependencies.unshift(filepath);
		return dependencies;
	}

	/**
	 * Returns True if A depends on B.
	 */
	public checkDependency(filepath: string, filepathToCheck: string): boolean {
		filepathToCheck = pathUtils.normalize(filepathToCheck);
		return this.getDependencies(filepath).indexOf(filepathToCheck) !== -1;
	}

	private traverse(filepath: string, keys: string[], result: string[], maxIterations: number): string[] {
		const dependencies = this.storage.get(filepath).dependencies;

		// Prevent infinite recursion
		maxIterations--;

		for (let i = 0; i < dependencies.length; i++) {
			const dependency = dependencies[i];
			if (result.indexOf(dependency) === -1) {
				result.push(dependency);
			}

			const matches = micromatch(keys, dependency);
			for (let j = 0; j < matches.length; j++) {
				const match = matches[j];
				if (match === filepath) {
					continue;
				}
				if (result.indexOf(match) === -1) {
					result.push(match);
				}
				if (this.storage.has(match) && maxIterations > -1) {
					this.traverse(match, keys, result, maxIterations);
				}
			}
		}

		return result;
	}

}
