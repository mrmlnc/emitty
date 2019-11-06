import * as fs from 'fs';

export type FileSystemAdapter = {
	access: typeof fs.access;
	constants: typeof fs.constants;
	readFile: typeof fs.readFile;
};

export const FILE_SYSTEM_ADAPTER: FileSystemAdapter = {
	access: fs.access,
	constants: fs.constants,
	readFile: fs.readFile
};

export function createFileSystemAdapter(fsMethods?: Partial<FileSystemAdapter>): FileSystemAdapter {
	if (fsMethods === undefined) {
		return FILE_SYSTEM_ADAPTER;
	}

	return {
		...FILE_SYSTEM_ADAPTER,
		...fsMethods
	};
}
