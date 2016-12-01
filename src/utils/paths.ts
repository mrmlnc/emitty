'use strict';

import * as path from 'path';

export function normalize(filepath: string): string {
	return filepath.replace(/\\/g, '/');
}

export function join(a: string, b: string): string {
	return normalize(path.join(a, b));
}

export function relative(from: string, to: string): string {
	return normalize(path.relative(from, to));
}
