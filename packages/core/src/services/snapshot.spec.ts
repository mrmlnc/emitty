import * as assert from 'assert';
import * as path from 'path';

import * as sinon from 'sinon';

import SettingsService from './settings';
import StorageService from './storage';
import SnapshotService, { Snapshot } from './snapshot';

describe('Services → Snapshot', () => {
	describe('.load', () => {
		it('should do nothing when version is not matched', () => {
			const settings = new SettingsService();
			const storage = new StorageService();
			const snapshot = new SnapshotService(settings, storage);

			const storageSetMethodStub = sinon.stub(storage, 'set');

			snapshot.load({
				version: 0,
				options: { cwd: 'custom' },
				references: {}
			});

			sinon.assert.notCalled(storageSetMethodStub);
		});

		it('should do nothing when options is not matched', () => {
			const settings = new SettingsService();
			const storage = new StorageService();
			const snapshot = new SnapshotService(settings, storage);

			const storageSetMethodStub = sinon.stub(storage, 'set');

			snapshot.load({
				version: settings.version,
				options: { cwd: 'custom' },
				references: {}
			});

			sinon.assert.notCalled(storageSetMethodStub);
		});

		it('should load snapshot to storage with resolved paths', () => {
			const settings = new SettingsService();
			const storage = new StorageService();
			const snapshot = new SnapshotService(settings, storage);

			const storageSetMethodStub = sinon.stub(storage, 'set');

			const homeFilePath = path.resolve('home.pug');

			snapshot.load({
				version: settings.version,
				options: settings.options,
				references: { 'home.pug': [] }
			});

			sinon.assert.calledWith(storageSetMethodStub, homeFilePath, sinon.match.object);
		});
	});

	describe('.dump', () => {
		it('should return a snapshot with relative paths', () => {
			const settings = new SettingsService();
			const storage = new StorageService();
			const snapshot = new SnapshotService(settings, storage);

			storage.set(path.join('directory', 'file.pug'), { references: [] });

			const expected: Snapshot = {
				version: settings.version,
				options: settings.options,
				references: { 'directory/file.pug': [] }
			};

			const actual = snapshot.dump();

			assert.deepStrictEqual(actual, expected);
		});
	});
});
