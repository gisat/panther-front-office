import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {BASIC_STATE as BASIC_STATE_DS, EMPTY_DATA_STATE as EMPTY_DATA_STATE_DS,  NULL_DATA_STATE as NULL_DATA_STATE_DS} from "../../../../__testUtils/sampleStates/attributeDataSources";
import {BASIC_STATE as BASIC_STATE_REL, EMPTY_DATA_STATE as EMPTY_DATA_STATE_REL, NULL_DATA_STATE as NULL_DATA_STATE_REL} from "../../../../__testUtils/sampleStates/attributeRelations";

const BASIC_STATE = {...BASIC_STATE_DS, ...BASIC_STATE_REL};
const EMPTY_RELATIONS = {...BASIC_STATE_DS, ...EMPTY_DATA_STATE_REL};
const NULL_RELATIONS = {...BASIC_STATE_DS, ...NULL_DATA_STATE_REL};
const EMPTY_SOURCES = {...BASIC_STATE_REL, ...EMPTY_DATA_STATE_DS};
const NULL_SOURCES = {...BASIC_STATE_REL, ...NULL_DATA_STATE_DS};

describe('#getFiltered', () => {
	it('should select data sources for given filters', () => {

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

		const expectedOutput = {
			key: 'ds2',
			data: {
				value: "field"
			}
		};

		Selector(Select.attributeDataSources.getFiltered).expect(BASIC_STATE, filter).toReturn(expectedOutput);
	});
	
	it('should return null data for given filters', () => {

		const filter = {
			attributeKey: "blablabla",
			attributeSetKey: "attSet1",
			scopeKey: "scope1",
			periodKey: null,
			caseKey: null,
			scenarioKey: null,
			placeKey: null,
			layerTemplateKey: "lt1",
			areaTreeLevelKey: null,
		}

		const expectedOutput = null;

		Selector(Select.attributeDataSources.getFiltered).expect(BASIC_STATE, filter).toReturn(expectedOutput);
	});

	it('should return null data for given filters', () => {

		const filter = {
			attributeKey: "att1",
			attributeSetKey: null,
			scopeKey: "scope1",
			periodKey: null,
			caseKey: null,
			scenarioKey: null,
			placeKey: null,
			layerTemplateKey: "lt1",
			areaTreeLevelKey: null,
		}

		const expectedOutput = {
			key: "ds1",
			data: {
				value: "field"
			}
		};

		Selector(Select.attributeDataSources.getFiltered).expect(BASIC_STATE, filter).toReturn(expectedOutput);
	});
})