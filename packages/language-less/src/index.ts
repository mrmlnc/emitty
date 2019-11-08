import * as parser from 'less-symbols-parser';

export type File = {
	references: string[];
};

export function parse(_filepath: string, buffer: Buffer): Promise<File> {
	const symbols = parser.parseSymbols(buffer.toString());
	const references = symbols.imports.map((symbol) => symbol.filepath);

	return Promise.resolve({ references });
}
