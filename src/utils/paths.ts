'use strict';

import * as path from 'path';

// RegExp's
const reGlobBaseName = /^\*\*\/([\w\.-]+)\/?$/;

export function normalize(filepath: string): string {
	return filepath.replace(/\\/g, '/');
}

export function join(a: string, b: string): string {
	return normalize(path.join(a, b));
}

export function relative(from: string, to: string): string {
	return normalize(path.relative(from, to));
}

export function expandGlobPatterns(toExclude: string[]) {
	const result = toExclude;

	// Expand **/name to  **/name + **/name/**
	if (result) {
		toExclude.forEach((pattern) => {
			if (reGlobBaseName.test(pattern)) {
				result.push(pattern + '/**');
			}
		});
	}

	return result;
}
