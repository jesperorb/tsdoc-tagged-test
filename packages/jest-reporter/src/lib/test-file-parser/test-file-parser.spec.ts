import { TSDocParser } from '@microsoft/tsdoc';

import {
	testFileParserBasicFileName,
	testFileParserBasicSourceFile,
} from './test-data/test-file-parser-basic.source-file';
import { testFileParserBasicAggregatedResult } from './test-data/test-file-parser-basic.test-results';

import { parseTestFiles } from '.';

test('parse and tag test for files', () => {
	const taggedTestResults = parseTestFiles({
		testResults: testFileParserBasicAggregatedResult.testResults,
		tsDocParser: new TSDocParser(),
		sourceFilesMap: {
			[testFileParserBasicFileName]: testFileParserBasicSourceFile,
		},
	});
	expect(taggedTestResults[0].testFilePath).toEqual(
		'test-file-parser-basic.source-file.ts'
	);
	const testResult = taggedTestResults[0].testResults;
	const firstResult = testResult[0];
	expect(firstResult.title).toEqual('should validate email');
	expect(firstResult.ancestorTitles).toEqual(['form validation']);
	const firstTag = firstResult.testBlockComments?.[0];
	expect(firstTag?.testFilePath).toEqual(
		'test-file-parser-basic.source-file.ts'
	);
	expect(firstTag?.title).toEqual('should validate email');
	const tags = firstTag?.testBlockTags
		? firstTag.testBlockTags['@remarks']
		: undefined;
	expect(tags?.tags).toEqual(['acceptance criteria']);
	expect(tags?.testTitle).toEqual('should validate email');
});
