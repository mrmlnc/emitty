export type Language = {
	extensions: string[];
	parser: LanguageParserFunction;
};

export type LanguageParserFunction = (filepath: string, buffer: Buffer) => Promise<LanguageFile>;

export type LanguageFile = {
	references: string[];
};

export default class LanguageService {
	private readonly _languages: Map<string, Language> = new Map();

	public get(extension: string): Language | undefined {
		return this._languages.get(extension);
	}

	public set(extension: string, language: Language): void {
		this._languages.set(extension, language);
	}
}
