import _ from 'lodash';
import Select from '../../../state/Select';
import {Selector} from 'redux-testkit';

let state = {
	lpisCases: {
		cases: {
			activeCaseKey: null,
			data: [{
				key: 1,
				data: {
					"submit_date": "2018-07-18T14:33:59Z",
					"code_dpb": "18/664/EPU/1/0020487",
					"code_ji": "",
					"case_key": "",
					"change_description": "",
					"change_description_place": "",
					"change_description_other": "",
					"evaluation_result": "",
					"evaluation_description": "",
					"evaluation_description_other": "",
					"evaluation_used_sources": "",
					"geometry_before": {"GEOJsonGeometryObject": true},
					"geometry_after": {"GEOJsonGeometryObject": true},
					"view_id": 1,
					"place_id": 1
				}
			},{
				key: 2,
				data: {
					"submit_date": "2017-05-22T14:33:59Z",
					"code_dpb": "17/554/EPU/1/0055949",
					"code_ji": "",
					"case_key": "",
					"change_description": "",
					"change_description_place": "",
					"change_description_other": "",
					"evaluation_result": "",
					"evaluation_description": "",
					"evaluation_description_other": "",
					"evaluation_used_sources": "",
					"geometry_before": {"GEOJsonGeometryObject": true},
					"geometry_after": {"GEOJsonGeometryObject": true},
					"view_id": 1,
					"place_id": 2
				}
			},{
				key: 3,
				data: {
					"submit_date": "2017-06-12T15:05:41Z",
					"code_dpb": "16/219/EPU/2/0013126",
					"code_ji": "",
					"case_key": "",
					"change_description": "",
					"change_description_place": "",
					"change_description_other": "",
					"evaluation_result": "",
					"evaluation_description": "",
					"evaluation_description_other": "",
					"evaluation_used_sources": "",
					"geometry_before": {"GEOJsonGeometryObject": true},
					"geometry_after": {"GEOJsonGeometryObject": true},
					"view_id": 1,
					"place_id": 3
				}
			},{
				key: 4,
				data: {
					"submit_date": "2017-06-13T15:12:11Z",
					"code_dpb": "16/219/EPU/2/1478456",
					"code_ji": "",
					"case_key": "",
					"change_description": "",
					"change_description_place": "",
					"change_description_other": "",
					"evaluation_result": "",
					"evaluation_description": "",
					"evaluation_description_other": "",
					"evaluation_used_sources": "",
					"geometry_before": {"GEOJsonGeometryObject": true},
					"geometry_after": {"GEOJsonGeometryObject": true},
					"view_id": 1,
					"place_id": 4
				}
			}]
		},
		changes: [{
			key: 1,
			data: {
				"lpis_case_id": 1,
				"status": "created",
				"changed": "2018-07-18T14:33:59Z",
				"changed_by": 1
			}
		},{
			key: 2,
			data: {
				"lpis_case_id": 1,
				"status": "prepared",
				"changed": "2018-07-18T17:33:59Z",
				"changed_by": 2
			}
		},{
			key: 3,
			data: {
				"lpis_case_id": 2,
				"status": "created",
				"changed": "2018-12-22T16:33:59Z",
				"changed_by": 2
			}
		},{
			key: 4,
			data: {
				"lpis_case_id": 3,
				"status": "created",
				"changed": "2018-12-22T16:33:57Z",
				"changed_by": 1
			}
		},{
			key: 5,
			data: {
				"lpis_case_id": 3,
				"status": "prepared",
				"changed": "2018-12-23T17:34:57Z",
				"changed_by": 2
			}
		},{
			key: 6,
			data: {
				"lpis_case_id": 3,
				"status": "approved",
				"changed": "2018-12-26T07:25:04Z",
				"changed_by": 3
			}
		},{
			key: 7,
			data: {
				"lpis_case_id": 4,
				"status": "created",
				"changed": "2018-10-27T16:54:57Z",
				"changed_by": 18
			}
		}]
	}
};

describe('Lpis cases selectors', () => {
	it ('should select all cases', () => {
		let stateClone = _.cloneDeep(state);
		Selector(Select.lpisCases.getCases).expect(state).toReturn(stateClone.lpisCases.cases.data);

	});
});