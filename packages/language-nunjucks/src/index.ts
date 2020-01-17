import * as nunjucks from 'nunjucks';

export type File = {
	references: string[];
};

export function parse(_filepath: string, buffer: Buffer): Promise<File> {
	const references: string[] = [];

	const tree = nunjucks.parser.parse(buffer.toString());
	const nodes = [
		...tree.findAll(nunjucks.nodes.Extends),
		...tree.findAll(nunjucks.nodes.Include),
		...tree.findAll(nunjucks.nodes.Import),
		...tree.findAll(nunjucks.nodes.FromImport)
	];

	for (const node of nodes) {
		if (node.template === undefined) {
			continue;
		}

		const value = node.template.value;

		if (value !== undefined) {
			references.push(value);
		}
	}

	return Promise.resolve({
		references
	});
}
