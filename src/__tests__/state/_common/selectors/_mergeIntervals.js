import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {BASIC_STATE, getSubstate} from "../../../../__testUtils/sampleStates/_common";

describe('#_mergeIntervals', () => {
	it('should return null', () => {
		const NO_INTERVALS = null;
		expect(commonSelectors._mergeIntervals(NO_INTERVALS)).toBeNull();
	});

	it('should return empty array', () => {
		const EMPTY_INTERVALS = [];
		expect(commonSelectors._mergeIntervals(EMPTY_INTERVALS)).toBeNull();
	});

	it('should return given array', () => {
		const ONE_INTERVAL = [{start: 1, length: 5}];
		expect(commonSelectors._mergeIntervals(ONE_INTERVAL)).toEqual(ONE_INTERVAL);
	});

	it('should return expected output', () => {
		const INTERVAL = [{start: 1, length: 5}, {start: 2, length: 5}];
		const expectedOutput = [{start: 1, length: 6}];
		expect(commonSelectors._mergeIntervals(INTERVAL)).toEqual(expectedOutput);
	});

	it('should return expected output 2', () => {
		const INTERVAL = [{start: 1, length: 5}, {start: 3, length: 3}];
		const expectedOutput = [{start: 1, length: 5}];
		expect(commonSelectors._mergeIntervals(INTERVAL)).toEqual(expectedOutput);
	});

	it('should return expected output 3', () => {
		const INTERVAL = [{start: 1, length: 5}, {start: 4, length: 5}];
		const expectedOutput = [{start: 1, length: 8}];
		expect(commonSelectors._mergeIntervals(INTERVAL)).toEqual(expectedOutput);
	});

	it('should return expected output 4', () => {
		const INTERVAL = [{start: 1, length: 5}, {start: 5, length: 5}];
		const expectedOutput = [{start: 1, length: 9}];
		expect(commonSelectors._mergeIntervals(INTERVAL)).toEqual(expectedOutput);
	});

	it('should return expected output 5', () => {
		const INTERVAL = [{start: 1, length: 5}, {start: 6, length: 5}];
		const expectedOutput = [{start: 1, length: 10}];
		expect(commonSelectors._mergeIntervals(INTERVAL)).toEqual(expectedOutput);
	});

	it('should return expected output 6', () => {
		const INTERVAL = [{start: 1, length: 5}, {start: 7, length: 5}];
		const expectedOutput = [{start: 1, length: 5}, {start: 7, length: 5}];
		expect(commonSelectors._mergeIntervals(INTERVAL)).toEqual(expectedOutput);
	});

	it('should return expected output 7', () => {
		const INTERVAL = [{start: 1, length: 5}, {start: 7, length: 5}, {start: 10, length: 5}];
		const expectedOutput = [{start: 1, length: 5}, {start: 7, length: 8}];
		expect(commonSelectors._mergeIntervals(INTERVAL)).toEqual(expectedOutput);
	});

	it('should return expected output 8', () => {
		const INTERVAL = [{start: 1, length: 5}, {start: 10, length: 5}, {start: 7, length: 5}];
		const expectedOutput = [{start: 1, length: 5}, {start: 7, length: 8}];
		expect(commonSelectors._mergeIntervals(INTERVAL)).toEqual(expectedOutput);
	});

	it('should return expected output 9', () => {
		const INTERVAL = [{start: 1, length: 5}, {}, {start: 7, length: 5}];
		const expectedOutput = [{start: 1, length: 5}, {start: 7, length: 5}];
		expect(commonSelectors._mergeIntervals(INTERVAL)).toEqual(expectedOutput);
	});

	it('should return expected output 10', () => {
		const INTERVAL = [{start: 1, length: 5}, null, {start: 7, length: 5}];
		const expectedOutput = [{start: 1, length: 5}, {start: 7, length: 5}];
		expect(commonSelectors._mergeIntervals(INTERVAL)).toEqual(expectedOutput);
	});

	it('should return expected output 11', () => {
		const INTERVAL = [{start: 1, length: 10}, {start: 3, length: 3}];
		const expectedOutput = [{start: 1, length: 10}];
		expect(commonSelectors._mergeIntervals(INTERVAL)).toEqual(expectedOutput);
	});
});