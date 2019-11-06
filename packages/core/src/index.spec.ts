import * as assert from 'assert';
import * as path from 'path';

import * as sinon from 'sinon';

import StorageService from './services/storage';
import LanguageService from './services/language';
import LinkerService from './services/linker';
import ResolverService from './services/resolver';
import SettingsService from './services/settings';
import ContainerService from './services/container';
import SnapshotService, { Snapshot } from './services/snapshot';
import Emitty, { configure } from '.';

function buildEmitty(services: Partial<ContainerService> = {}): Emitty {
	const language = new LanguageService();
	const storage = new StorageService();
	const linker = new LinkerService(storage);
	const settings = new SettingsService();
	const snapshot = new SnapshotService(settings, storage);
	const resolver = new ResolverService(settings, language, storage);

	const container = new ContainerService({
		language,
		linker,
		resolver,
		settings,
		snapshot,
		storage,
		...services
	});

	return new Emitty(container);
}

describe('Emitty', () => {
	describe('.language', () => {
		it('should set passed language to each extension', () => {
			const language = new LanguageService();

			const languageSetMethodStub = sinon.stub(language, 'set');

			const emitty = buildEmitty({ language });

			emitty.language({
				extensions: ['.txt', '.md'],
				parser: sinon.stub()
			});

			sinon.assert.calledWith(languageSetMethodStub.firstCall, '.txt', sinon.match.object);
			sinon.assert.calledWith(languageSetMethodStub.secondCall, '.md', sinon.match.object);
		});
	});

	describe('.load', () => {
		it('should call the "load" method of snapshot service', () => {
			const storage = new StorageService();
			const settings = new SettingsService();
			const snapshot = new SnapshotService(settings, storage);

			const snapshotLoadMethodStub = sinon.stub(snapshot, 'load');

			const emitty = buildEmitty({ storage, settings, snapshot });

			emitty.load({} as unknown as Snapshot);

			sinon.assert.calledOnce(snapshotLoadMethodStub);
		});
	});

	describe('.dump', () => {
		it('should call the "dump" method of snapshot service', () => {
			const storage = new StorageService();
			const settings = new SettingsService();
			const snapshot = new SnapshotService(settings, storage);

			const snapshotDumpMethodStub = sinon.stub(snapshot, 'dump').returns({} as unknown as Snapshot);

			const emitty = buildEmitty({ storage, settings, snapshot });

			const actual = emitty.dump();

			sinon.assert.calledOnce(snapshotDumpMethodStub);

			assert.deepStrictEqual(actual, {});
		});
	});

	describe('.clear', () => {
		it('should call the "clear" method of storage service', () => {
			const storage = new StorageService();

			const storageClearMethodStub = sinon.stub(storage, 'clear');

			const emitty = buildEmitty({ storage });

			emitty.clear();

			sinon.assert.calledOnce(storageClearMethodStub);
		});
	});

	describe('.filter', () => {
		it('should call resolver with the "recursive" argument when the changed file is not provided', async () => {
			const language = new LanguageService();
			const storage = new StorageService();
			const settings = new SettingsService();
			const resolver = new ResolverService(settings, language, storage);

			const resolverResolveMethodStub = sinon.stub(resolver, 'resolve');
			const homeFullPath = path.resolve('home.pug');

			const emitty = buildEmitty({ language, storage, settings, resolver });

			const actual = await emitty.filter('home.pug');

			sinon.assert.calledWith(resolverResolveMethodStub, homeFullPath, /* recursive */ true);

			assert.ok(actual);
		});

		it('should call resolver with the changed reference file', async () => {
			const language = new LanguageService();
			const settings = new SettingsService();
			const storage = new StorageService();
			const linker = new LinkerService(storage);
			const resolver = new ResolverService(settings, language, storage);

			const resolverResolveMethodStub = sinon.stub(resolver, 'resolve');
			const homeFullPath = path.resolve('home.pug');
			const headerFullPath = path.resolve('header.pug');

			storage.set(homeFullPath, {
				references: [headerFullPath]
			});

			storage.set(headerFullPath, { references: [] });

			const emitty = buildEmitty({ language, linker, storage, settings, resolver });

			const actual = await emitty.filter('home.pug', 'header.pug');

			sinon.assert.calledWith(resolverResolveMethodStub, headerFullPath);

			assert.ok(actual);
		});

		it('should call resolver with the changed non-reference file', async () => {
			const language = new LanguageService();
			const settings = new SettingsService();
			const storage = new StorageService();
			const linker = new LinkerService(storage);
			const resolver = new ResolverService(settings, language, storage);

			sinon.stub(resolver, 'resolve');

			const homeFullPath = path.resolve('home.pug');

			storage.set(homeFullPath, {
				references: []
			});

			const emitty = buildEmitty({ language, linker, storage, settings, resolver });

			const actual = await emitty.filter('home.pug', 'header.pug');

			assert.ok(!actual);
		});
	});

	describe('.configure', () => {
		it('should return an Emitty instance', () => {
			const actual = configure();

			assert.ok(actual instanceof Emitty);
		});
	});
});
