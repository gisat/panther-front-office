import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {BASIC_STATE, EMPTY_DATA_STATE, NULL_DATA_STATE} from "../../../../__testUtils/sampleStates/spatialRelations";

describe('#getAllData', () => {
	it('should select all relations data', () => {
		const expectedLength = Object.keys(BASIC_STATE.spatialRelations.byKey).length;

		let result = Selector(Select.spatialRelations.getAllData).execute(BASIC_STATE);
		expect(Selector(Select.spatialRelations.getAllData).execute(BASIC_STATE)).toHaveLength(expectedLength);
		expect(result[0]).toHaveProperty('scopeKey');
	});

	it('should return empty array for empty relations data', () => {
		expect(Selector(Select.spatialRelations.getAllData).execute(EMPTY_DATA_STATE)).toHaveLength(0);
	});

	it('should return null for null relations data', () => {
		expect(Selector(Select.spatialRelations.getAllData).execute(NULL_DATA_STATE).length).toBe(0);
	});
});