'use strict';

import * as path from 'path';

import { ILanguage } from '../services/config';

function normalizeExtension(filepath: string, extensions: string[]): string {
	if (!path.extname(filepath)) {
		filepath = filepath + extensions[0];
	}

	return filepath;
}

/**
 * Search for dependencies in the languages is based on indentation.
 */
function indentBasedLanguage(content: string, language: ILanguage): string[] {
	const dependencies: string[] = [];

	const reCommentStart = new RegExp(language.comments.start);
	const lineStart = /^(\s*)/;
	const lines = content.split(/\r?\n/);

	let keyword: RegExpExecArray;
	let comment: RegExpExecArray;
	let indent = -1;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (language.comments) {
			// Skip lines without comment substring
			comment = reCommentStart.exec(line);

			// indent === -1 - because Jade & Pug supports nested comments
			if (indent === -1 && comment) {
				indent = comment.index;
				continue;
			}

			// If the index of nesting of string is a beginning of a comment
			comment = lineStart.exec(line);
			if (indent === comment[0].length || comment[0].length === 0) {
				indent = -1;
			}

			// If this is not a comment
			if (indent === -1) {
				keyword = language.matcher.exec(line);
			}
		}

		if (keyword) {
			const filepath = keyword[1].trim();
			dependencies.push(normalizeExtension(filepath, language.extensions));
		}
	}

	return dependencies;
}

/**
 * Search dependencies in the regular languages.
 */
function regularLanguage(content: string, language: ILanguage): string[] {
	const dependencies: string[] = [];

	const commentStart = language.comments.start;
	const commentEnd = language.comments.end;
	const length = content.length;

	let pos = 0;
	let next = 0;
	let char;
	let escaped = true;
	let escapePos = 0;
	let buf = '';
	let text = '';

	while (pos < length) {
		char = content[pos];

		// Is the start of a comment?
		if (char === commentStart[0]) {
			buf = content.substr(pos, commentStart.length);
			if (buf !== commentStart) {
				pos += commentStart.length;
				text += buf;
				buf = '';
				continue;
			}
			pos += commentStart.length;

			// Search end of comment
			while (pos < length) {
				char = content[pos];

				// We should skip quotes
				if (char === '\'' || char === '"') {
					const quote = char === '\'' ? '\'' : '"';
					next = pos;

					// Skip escaped quotes
					do {
						escaped = false;
						next = text.indexOf(quote, next + 1);
						if (next === -1) {
							next = pos + 1;
							break;
						}
						escapePos = next;
						while (content[escapePos - 1] === '\\') {
							escapePos--;
							escaped = !escaped;
						}
					} while (escaped);

					pos = next + 1;
				}

				// Is the end of a comment?
				char = content[pos];
				if (char === commentEnd[0]) {
					buf = content.substr(pos, commentEnd.length);
					if (buf === commentEnd) {
						pos += commentEnd.length;
						break;
					}
					pos += commentEnd.length;
				}
				pos++;
			}
		}

		// Create a new text without comments
		text += content[pos];
		pos++;
	}

	if (text) {
		const matches = text.match(new RegExp(language.matcher.source, 'g')) || [];

		for (let i = 0; i < matches.length; i++) {
			const keyword = language.matcher.exec(matches[i]);
			if (keyword) {
				const filepath = keyword[1].trim();
				dependencies.push(normalizeExtension(filepath, language.extensions));
			}
		}
	}

	return dependencies;
}

export function parseDependencies(content: string, language: ILanguage): string[] {
	if (language.indentBased) {
		return indentBasedLanguage(content, language);
	}

	return regularLanguage(content, language);
}
