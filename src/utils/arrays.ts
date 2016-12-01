'use strict';

export function uniquePrimitiveArray(a: (number | string)[]): any[] {
	const b = [];

	for (let i = 0; i < a.length; i++) {
		if (b.indexOf(a[i]) === -1) {
			b.push(a[i]);
		}
	}

	return b;
}
