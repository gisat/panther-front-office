import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_MODELS_STATE, EMPTY_MODELS_STATE, NO_INDEXES_STATE, EMPTY_INDEXES_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getByFilterOrder', () => {
	it('selected data should equal expected collection', () => {
		const order = null;
		const filter = {scope: 666};

		let basicStateExpectedOutput = [{
			data: {
				name: "World"
			},
			key: 1,
			permissions: {
				activeUser: {get: true, update: true, delete: true},
				guest: {get: true, update: false, delete: false}
			}
		}, null, {
			data: {
				name: "Italy"
			},
			key: 3,
			permissions: {
				activeUser: {get: true, update: true, delete: true},
				guest: {get: false, update: false, delete: false}
			}
		}, {
			key: 11
		}];

		expect(commonSelectors.getByFilterOrder(getSubstate)(BASIC_STATE, filter, order)).toEqual(basicStateExpectedOutput);
	});

	it('selected data should have same length as expected collection', () => {
		const order = [['name', 'ascending']];
		const filter = null;

		expect(commonSelectors.getByFilterOrder(getSubstate)(BASIC_STATE, filter, order)).toHaveLength(10);
	});

	it('it should select null, if byKey does not exist', () => {
		const order = null;
		const filter = {scope: 666};
		const expectedResult = [{"key": 1}, null, {"key": 3}, {"key": 11}];
		expect(commonSelectors.getByFilterOrder(getSubstate)(NO_MODELS_STATE, filter, order)).toEqual(expectedResult);
	});

	it('it should select null, if byKey is empty object', () => {
		const order = null;
		const filter = {scope: 666};
		const expectedResult = [{"key": 1}, null, {"key": 3}, {"key": 11}];
		expect(commonSelectors.getByFilterOrder(getSubstate)(EMPTY_MODELS_STATE, filter, order)).toEqual(expectedResult);
	});

	it('it should select null, if indexes does not exist', () => {
		const order = null;
		const filter = {scope: 666};
		expect(commonSelectors.getByFilterOrder(getSubstate)(NO_INDEXES_STATE, filter, order)).toBeNull();
	});

	it('it should select null, if indexes ale empty', () => {
		const order = null;
		const filter = {scope: 666};
		expect(commonSelectors.getByFilterOrder(getSubstate)(EMPTY_INDEXES_STATE, filter, order)).toBeNull();
	});
});