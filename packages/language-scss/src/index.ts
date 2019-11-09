import * as path from 'path';

import * as parser from 'scss-symbols-parser';

export type File = {
	references: string[];
};

export function parse(_filepath: string, buffer: Buffer): Promise<File> {
	const symbols = parser.parseSymbols(buffer.toString());

	const references = symbols.imports.reduce((collection, symbol) => {
		if (hasExtension(symbol.filepath)) {
			collection.push(...[
				symbol.filepath,
				formatPartialImport(symbol.filepath)
			]);
		} else {
			collection.push(...[
				`${symbol.filepath}.sass`,
				`${symbol.filepath}.scss`,

				// https://sass-lang.com/documentation/at-rules/import#index-files
				`${symbol.filepath}/_index.sass`,
				`${symbol.filepath}/_index.scss`,

				// https://sass-lang.com/documentation/at-rules/import#partials
				formatPartialImport(symbol.filepath, '.sass'),
				formatPartialImport(symbol.filepath, '.scss')
			]);
		}

		return collection;
	}, [] as string[]);

	return Promise.resolve({ references });
}

function hasExtension(filepath: string): boolean {
	return path.extname(filepath) !== '';
}

function formatPartialImport(filepath: string, extension: string = ''): string {
	const directory = path.dirname(filepath);
	const name = path.basename(filepath);

	const prefix = directory === '.' ? '' : `${directory}/`;

	return `${prefix}_${name}${extension}`;
}
