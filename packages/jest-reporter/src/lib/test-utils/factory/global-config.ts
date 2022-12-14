import type { Config } from '@jest/reporters';
import { TestDataFactory } from '@tsdoc-tagged-test/core';

export const globalConfigFactory: TestDataFactory<Config.GlobalConfig> = (
	overrides = {}
) => ({
	bail: 0,
	changedSince: undefined,
	changedFilesWithAncestor: false,
	ci: false,
	collectCoverage: false,
	collectCoverageFrom: [],
	coverageDirectory: 'default-coverage-directory',
	coveragePathIgnorePatterns: undefined,
	coverageProvider: 'v8',
	coverageReporters: ['json'],
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
	},
	detectLeaks: false,
	detectOpenHandles: false,
	expand: false,
	filter: undefined,
	findRelatedTests: false,
	forceExit: false,
	json: true,
	globalSetup: undefined,
	globalTeardown: undefined,
	lastCommit: false,
	logHeapUsage: false,
	listTests: true,
	maxConcurrency: 0,
	maxWorkers: 0,
	noStackTrace: true,
	nonFlagArgs: [],
	noSCM: true,
	notify: true,
	notifyMode: 'always',
	outputFile: undefined,
	onlyChanged: false,
	onlyFailures: false,
	passWithNoTests: false,
	projects: [],
	replname: undefined,
	reporters: undefined,
	runTestsByPath: false,
	rootDir: '.',
	shard: undefined,
	silent: undefined,
	skipFilter: false,
	snapshotFormat: {},
	errorOnDeprecated: false,
	testFailureExitCode: 0,
	testNamePattern: undefined,
	testPathPattern: '',
	testResultsProcessor: undefined,
	testSequencer: '',
	testTimeout: undefined,
	updateSnapshot: 'all',
	useStderr: false,
	verbose: undefined,
	watch: false,
	watchAll: false,
	watchman: false,
	watchPlugins: undefined,
	workerIdleMemoryLimit: undefined,
	...overrides,
});
