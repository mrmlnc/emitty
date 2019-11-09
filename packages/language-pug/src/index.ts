import * as lexer from 'pug-lexer';

export type File = {
	references: string[];
};

export function parse(_filepath: string, buffer: Buffer): Promise<File> {
	const references: string[] = [];

	const tokens = lexer(buffer.toString());

	for (const token of tokens) {
		if (token.type === lexer.TokenType.Path) {
			const value = token.val.trim();

			references.push(value);
		}
	}

	return Promise.resolve({ references });
}
