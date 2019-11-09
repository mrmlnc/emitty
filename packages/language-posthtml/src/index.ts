import * as parser from 'posthtml-parser';

export type File = {
	references: string[];
};

export function parse(_filepath: string, buffer: Buffer): Promise<File> {
	const references: string[] = [];

	const tree = parser(buffer.toString());

	for (const node of tree) {
		let value: string | undefined;

		if (typeof node === 'string') {
			continue;
		} else if (node.tag === 'module') {
			value = getAttribute(node, 'href');
		} else if (node.tag === 'include' || node.tag === 'extends') {
			value = getAttribute(node, 'src');
		}

		if (value !== undefined) {
			references.push(value.trim());
		}
	}

	return Promise.resolve({
		references
	});
}

function getAttribute(node: parser.NodeTag, name: string): string | undefined {
	return (node.attrs === undefined ? {} : node.attrs)[name];
}
