import { TsDocTaggedTestReporter } from './lib/reporter';
export { parseTestFiles } from './lib/test-file-parser';
export { groupTests } from './lib/grouper';
export { render } from './lib/renderer';
export * from './lib/types';

export default TsDocTaggedTestReporter;
