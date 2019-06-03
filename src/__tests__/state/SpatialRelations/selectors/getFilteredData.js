import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {BASIC_STATE, EMPTY_DATA_STATE, NULL_DATA_STATE} from "../../../../__testUtils/sampleStates/spatialRelations";

describe('#getFilteredData', () => {
	it('should select expected data if exists for given filter', () => {
		const filter = {
			dataSourceKey: "ds3",
			layerTemplateKey: "lt2",
			scopeKey: "scope1"
		};

		const expectedOutput = [{
			caseKey: null,
			dataSourceKey: "ds3",
			layerTemplateKey: "lt2",
			periodKey: null,
			placeKey: null,
			scenarioKey: null,
			scopeKey: "scope1"
		}];

		Selector(Select.spatialRelations.getFilteredData).expect(BASIC_STATE, filter).toReturn(expectedOutput);
	});

	it('should select empty array if there are no data for given filter', () => {
		const filter = {
			dataSourceKey: "ds5",
			layerTemplateKey: "lt2",
			scopeKey: "scope1"
		};

		Selector(Select.spatialRelations.getFilteredData).expect(BASIC_STATE, filter).toReturn([]);
	});

	it('should return null for empty relations data', () => {
		const filter = {
			dataSourceKey: "ds3",
			layerTemplateKey: "lt2",
			scopeKey: "scope1"
		};
		Selector(Select.spatialRelations.getFilteredData).expect(EMPTY_DATA_STATE, filter).toReturn(null);
	});

	it('should return null for null relations data', () => {
		const filter = {
			dataSourceKey: "ds3",
			layerTemplateKey: "lt2",
			scopeKey: "scope1"
		};
		expect(Selector(Select.spatialRelations.getFilteredData).execute(NULL_DATA_STATE, filter)).toBeNull();
	});
});