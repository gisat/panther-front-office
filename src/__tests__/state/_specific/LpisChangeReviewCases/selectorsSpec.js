import _ from 'lodash';
import Select from '../../../../state/Select';
import {Selector} from 'redux-testkit';

let state = {
	specific: {
		lpisChangeReviewCases: {
			activeCaseKey: null,
			cases: [{
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
			}, {
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
			}, {
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
			}, {
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
			}],
			changes: [{
				key: 1,
				data: {
					"lpis_case_id": 1,
					"status": "created",
					"date": "2018-07-18T14:33:59Z",
					"changed_by": 1
				}
			}, {
				key: 2,
				data: {
					"lpis_case_id": 1,
					"status": "prepared",
					"date": "2018-07-18T17:33:59Z",
					"changed_by": 2
				}
			}, {
				key: 3,
				data: {
					"lpis_case_id": 2,
					"status": "created",
					"date": "2018-12-22T16:33:59Z",
					"changed_by": 2
				}
			}, {
				key: 4,
				data: {
					"lpis_case_id": 3,
					"status": "created",
					"date": "2018-12-22T16:33:57Z",
					"changed_by": 1
				}
			}, {
				key: 5,
				data: {
					"lpis_case_id": 3,
					"status": "prepared",
					"date": "2018-12-23T17:34:57Z",
					"changed_by": 2
				}
			}, {
				key: 6,
				data: {
					"lpis_case_id": 3,
					"status": "approved",
					"date": "2018-12-26T07:25:04Z",
					"changed_by": 3
				}
			}, {
				key: 7,
				data: {
					"lpis_case_id": 4,
					"status": "created",
					"date": "2018-10-27T16:54:57Z",
					"changed_by": 18
				}
			}]
		}
	}
};

let minimalisticState = {
	specific: {
		lpisChangeReviewCases: {
			activeCaseKey: null,
			cases: [
				{
					key: 1,
					data: {
						"place_id": 1
					}
				}, {
					key: 2,
					data: {
						"place_id": 2
					}
				}],
			changes: [{
				key: 1,
				data: {
					"lpis_case_id": 1,
					"status": "CREATED",
					"date": "2018-12-23T17:34:57Z",
					"changed_by": 5
				}
			}, {
				key: 2,
				data: {
					"lpis_case_id": 1,
					"status": "PREPARED",
					"date": "2018-12-24T17:34:57Z",
					"changed_by": 5
				}
			}, {
				key: 3,
				data: {
					"lpis_case_id": 2,
					"status": "CREATED",
					"date": "2018-12-25T17:34:57Z",
					"changed_by": 5
				}
			}, {
				key: 7,
				data: {
					"lpis_case_id": 4,
					"status": "CREATED",
					"date": "2018-12-26T17:34:57Z",
					"changed_by": 5
				}
			}]
		}
	}
};

describe('Lpis change review cases selectors', () => {
	let stateClone = _.cloneDeep(state);
	it ('should select all cases', () => {
		Selector(Select.specific.lpisChangeReviewCases.getCases).expect(state).toReturn(stateClone.specific.lpisChangeReviewCases.cases);

	});
	it ('should select all changes', () => {
		let stateClone = _.cloneDeep(state);
		Selector(Select.specific.lpisChangeReviewCases.getChanges).expect(state).toReturn(stateClone.specific.lpisChangeReviewCases.changes);
	});
	it ('should select all cases extended with changes for each case', () => {
		let expectedFirstCase =  {
			key: 1,
			data: {
				"place_id": 1
			},
			changes: [{
				key: 2,
				data: {
					"lpis_case_id": 1,
					"status": "PREPARED",
					"date": "2018-12-24T17:34:57Z",
					"changed_by": 5
				}
			}, {
				key: 1,
				data: {
					"lpis_case_id": 1,
					"status": "CREATED",
					"date": "2018-12-23T17:34:57Z",
					"changed_by": 5
				}
			}],
			status: "PREPARED",
			updated: "2018-12-24T17:34:57Z",
			updatedBy: 5,
			createdBy: 5
		};

		let result = Selector(Select.specific.lpisChangeReviewCases.getCasesWithChanges).execute(minimalisticState);
		let firstCase = _.find(result, {key: 1});
		expect(firstCase).toEqual(expectedFirstCase);

	});
});