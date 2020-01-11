import * as nunjucks from 'nunjucks';

export type File = {
	references: string[];
};

export function parse(_filepath: string, buffer: Buffer): Promise<File> {
	const references: string[] = [];

	const tree = nunjucks.parser.parse(buffer.toString());
	const children = [
		...tree.findAll(nunjucks.nodes.Extends),
		...tree.findAll(nunjucks.nodes.Include),
		...tree.findAll(nunjucks.nodes.Import),
		...tree.findAll(nunjucks.nodes.FromImport)
	];

	const nodes = new Set([...children]);

	for (const node of nodes) {
		if (node.template !== undefined) {
			const value = node.template.value;

			if (value !== undefined) {
				references.push(value);
			}
		}

		if (node.children === undefined) {
			continue;
		}

		for (const child of node.children) {
			nodes.add(child);
		}
	}

	return Promise.resolve({
		references
	});
}
