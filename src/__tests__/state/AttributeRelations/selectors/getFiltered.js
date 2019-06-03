import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {BASIC_STATE as BASIC_STATE_REL, EMPTY_DATA_STATE as EMPTY_DATA_STATE_REL,  NULL_DATA_STATE as NULL_DATA_STATE_REL} from "../../../../__testUtils/sampleStates/attributeRelations";

const BASIC_STATE = {...BASIC_STATE_REL};


describe('#getFiltered', () => {
	it('should select relations for given filters', () => {

		const filter = {
			attributeKey: "att2",
			attributeSetKey: "attSet1",
			scopeKey: "scope1",
			periodKey: null,
			caseKey: null,
			scenarioKey: null,
			placeKey: null,
			layerTemplateKey: "lt1",
			areaTreeLevelKey: null,
		}

		const expectedOutput = [{
			dataSourceKey: "ds2",
			attributeKey: "att2",
			attributeSetKey: "attSet1",
			scopeKey: "scope1",
			periodKey: null,
			caseKey: null,
			scenarioKey: null,
			placeKey: null,
			layerTemplateKey: "lt1",
			areaTreeLevelKey: null,
		}];

		Selector(Select.attributeRelations.getFiltered).expect(BASIC_STATE, filter).toReturn(expectedOutput);
	});
	it('should return null for given filters', () => {

		const filter = {
			attributeKey: "blabla",
			attributeSetKey: "attSet1",
			scopeKey: "scope1",
			periodKey: null,
			caseKey: null,
			scenarioKey: null,
			placeKey: null,
			layerTemplateKey: "lt1",
			areaTreeLevelKey: null,
		}

		const expectedOutput = [];

		Selector(Select.attributeRelations.getFiltered).expect(BASIC_STATE, filter).toReturn(expectedOutput);
	});
})