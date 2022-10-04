import {
	AggregatedResult,
	Config,
	Reporter,
	TestContext,
} from '@jest/reporters';
import { TSDocParser } from '@microsoft/tsdoc';
import { BlockTagNames, coreDefaults } from '@tsdoc-tagged-test/core';
import type { CompilerOptions } from 'typescript';

import { defaultOutputFileName } from './defaultValues';

import { groupTests } from '../grouper';
import { render } from '../renderer';
import { parseTestFiles } from '../test-file-parser';
import type {
	OutputFileType,
	TaggedAggregatedResult,
	TestGroup,
	TestGrouperSchema,
	TsDocTaggedTestReporterConfig,
	UIOptions,
} from '../types';
import { getCompilerOptions, writeToFile } from '../utils/io';
import { getSourceFileHelper } from '../utils/typescript-helpers';

export default class TsDocTaggedTestReporter<CustomTag extends string>
	implements Pick<Reporter, 'onRunComplete'>
{
	private readonly applyTags: (BlockTagNames | CustomTag)[];
	private readonly customTags: CustomTag[] | undefined;
	private readonly tagSeparator: string;
	private readonly testBlockTagNames: string[];
	private readonly outputFileType: OutputFileType;
	private readonly outputFileName: string;
	private readonly groupBySchema?: TestGrouperSchema<BlockTagNames | CustomTag>;
	private readonly uiOptions: UIOptions;
	private readonly compilerOptions: CompilerOptions;

	constructor(
		_globalConfig: Config.GlobalConfig,
		config: TsDocTaggedTestReporterConfig<CustomTag>
	) {
		this.applyTags =
			config.applyTags ??
			(coreDefaults.applyTags as (BlockTagNames | CustomTag)[]);
		this.customTags = config.customTags;
		this.tagSeparator = config.tagSeparator ?? coreDefaults.tagSeparator;
		this.testBlockTagNames =
			config.testBlockTagNames ?? coreDefaults.testBlockTagNames;
		this.outputFileType = config.outputFileType;
		this.outputFileName = config.outputFileName ?? defaultOutputFileName;
		this.groupBySchema = config.groupBySchema;
		this.uiOptions = config.uiOptions ?? {};
		this.compilerOptions = getCompilerOptions(config.tsConfigPath);
	}

	public onRunComplete(
		_testContexts: Set<TestContext>,
		results: AggregatedResult
	): void | Promise<void> {
		const fileNames = results.testResults.map((result) => result.testFilePath);
		const getSourceFile = getSourceFileHelper(fileNames, this.compilerOptions);
		const sourceFilesMap = Object.fromEntries(
			results.testResults.map((result) => [
				result.testFilePath,
				getSourceFile(result.testFilePath),
			])
		);

		const taggedTestResults = parseTestFiles({
			applyTags: this.applyTags,
			customTags: this.customTags,
			tagSeparator: this.tagSeparator,
			testBlockTagNames: this.testBlockTagNames,
			testResults: results.testResults,
			tsDocParser: new TSDocParser(),
			sourceFilesMap,
		});

		const result: TaggedAggregatedResult = {
			...results,
			testResults: taggedTestResults,
		};

		let groupedResult: Map<string, TestGroup<string>> | undefined;

		if (this.groupBySchema) {
			groupedResult = groupTests({
				testResult: result,
				schema: this.groupBySchema,
			});
		}

		const buffer =
			this.outputFileType === 'html'
				? render(groupedResult ?? result, this.uiOptions)
				: JSON.stringify(groupedResult ?? result);

		writeToFile({
			outputFileType: this.outputFileType,
			outputFileName: this.outputFileName,
			buffer,
		});
	}
}
