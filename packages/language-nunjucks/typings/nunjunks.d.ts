declare module "nunjucks" {
	namespace nunjucks {
		export type Node = {
			children?: Node[];
			template?: Node;
			value?: string;
		}

		export type Parser = {
			parse(content: string): Node;
		};
	}

	const nunjucks: {
		parser: nunjucks.Parser;
	};

	export = nunjucks;
}
