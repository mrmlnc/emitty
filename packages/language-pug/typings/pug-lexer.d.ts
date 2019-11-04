declare module "pug-lexer" {
	function lexer(content: string): lexer.Token[];

	namespace lexer {
		export const enum TokenType {
			Path = 'path',
			Include = 'include',
			Extends = 'extends'
		}

		export type Token = {
			type: TokenType;
			val: string;
		};
	}

	export = lexer;
}
