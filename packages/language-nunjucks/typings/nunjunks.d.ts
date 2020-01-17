declare module 'nunjucks' {
	namespace nodes {
		export type Node = {
			findAll<TType extends NunjucksNodes>(type: TType, results?: []): TType[];
			value?: string;
			children: NunjucksNodes[];
		};

		type NodeList = Node & {
			children: NunjucksNodes[];
		};

		export type Root = NodeList;

		type TemplateRef = Node & {
			template?: NunjucksNodes;
		};

		type Extends = TemplateRef;

		type Include = Node & {
			template: NunjucksNodes;
		};

		type Import = Node & {
			template: NunjucksNodes;
		};

		type FromImport = Node & {
			template: NunjucksNodes;
		};

		export type Nodes = {
			Node: Node;
			Root: Root;
			Extends: Extends;
			Include: Include;
			Import: Import;
			FromImport: FromImport;
		};

		export type NunjucksNodes = Node | Root | Extends | Include | Import | FromImport;
	}

	namespace nunjucks {
		export type Parser = {
			parse(content: string): nodes.Root;
		};
	}

	const nunjucks: {
		parser: nunjucks.Parser;
		nodes: nodes.Nodes;
	};

	export = nunjucks;
}
