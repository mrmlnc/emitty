'use strict';

export interface ILanguageComment {
	start: string;
	end: string;
}

export interface ILanguage {
	extensions?: string[];
	matcher?: RegExp;
	extends?: string;
	comments?: ILanguageComment;
	indentBased?: boolean;
}

export const builtInConfigs = {
	jade: <ILanguage>{
		extensions: ['.jade'],
		matcher: /(?:^|:)\s*(?:include|extends):?.*\s+(.*)/,
		comments: {
			start: '//',
			end: ''
		},
		indentBased: true
	},

	pug: <ILanguage>{
		extends: 'jade',
		extensions: ['.pug']
	},

	nunjucks: <ILanguage>{
		extensions: ['.njk'],
		matcher: /{%\s*(?:include|import|extends)\s['"]([^'"]+)['"]\s.*?%}/,
		comments: {
			start: '{#',
			end: '#}'
		}
	},

	sugarml: <ILanguage>{
		extends: 'pug',
		extensions: ['.sgr', '.sml'],
		matcher: /(?:^|:)\s*(?:include|extends)\(?src=['"]([^'"]+)['"].*\)/
	},

	posthtml: <ILanguage>{
		extensions: ['.html'],
		matcher: /<(?:extends|include).*?src=['"]([^'"]+)['"].*?>/,
		comments: {
			start: '<!--',
			end: '-->'
		}
	},

	less: <ILanguage>{
		extensions: ['.less'],
		matcher: /@import.*?['"]([^'"]+)['"]\s*/,
		comments: {
			start: '//',
			end: '\n'
		}
	},

	stylus: <ILanguage>{
		extensions: ['.styl'],
		matcher: /^\s*@(?:import|require).*?['"]([^'"]+)['"]\s*/,
		comments: {
			start: '//',
			end: '\n'
		},
		indentBased: true
	},

	sass: <ILanguage>{
		extends: 'less',
		extensions: ['.sass'],
		indentBased: true
	},

	scss: <ILanguage>{
		extends: 'less',
		extensions: ['.scss']
	}
};

export class Config {

	private matcher: RegExp;
	private extensions: string[];
	private extends: string;
	private comments: ILanguageComment;

	private config: ILanguage;

	constructor(language: string | ILanguage) {
		if (typeof language === 'object') {
			this.matcher = language.matcher;
			this.extensions = language.extensions;
			this.extends = language.extends;
			this.comments = language.comments;

			this.assertExtensions();
			this.assertMatcher();
			this.assertComments();

			this.config = this.resolveConfig(language);
			return;
		}

		if (typeof language === 'string') {
			this.config = this.resolveConfig({ extends: language });
			return;
		}

		throw new TypeError('language must be a string or an object');
	}

	public getConfig(): ILanguage {
		return this.config;
	}

	private assertExtensions() {
		if ((!this.extends && !this.extensions) || (this.extensions && !Array.isArray(this.extensions))) {
			throw new TypeError('the "extensions" field must be an Array of strings');
		}
	}

	private assertMatcher() {
		if ((!this.extends && !this.matcher) || (this.matcher && this.matcher instanceof RegExp === false)) {
			throw new TypeError('the "matcher" field must be a RegExp');
		}
	}

	private assertComments() {
		let showError = false;
		if (!this.extends && !this.comments) {
			showError = true;
		} else if (!this.extends && this.comments && this.comments.start && this.comments.end) {
			if (typeof this.comments.start !== 'string' || typeof this.comments.end !== 'string') {
				showError = true;
			}
		}

		if (showError) {
			throw new TypeError('the "comment.start" and "comment.end" fields must be a string');
		}
	}

	private assertName(name: string) {
		if (!builtInConfigs.hasOwnProperty(name)) {
			throw new Error(`the configuration "${name}" clound not found`);
		}
	}

	private resolveConfig(language: ILanguage): ILanguage {
		if (!language.extends) {
			return language;
		}

		this.assertName(language.extends);
		let config: ILanguage = Object.assign({}, builtInConfigs[language.extends]);
		while (config.extends) {
			const next = Object.assign({}, builtInConfigs[config.extends]);

			delete config.extends;
			config = Object.assign(next, config);
		}

		delete language.extends;
		return Object.assign(config, language);
	}

}
