import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import utils from "../../utils/utils";

const INITIAL_STATE = {
	activeCaseKey: null,
	searchString: null,
	activeNewEditedCaseKey: null,
	editedCases: [],
	cases: [{
		key: 5646545641,
		data: {
			"submit_date": "2018-07-18T14:33:59Z",
			"code_dpb": "18/664/EPU/1/0020487",
			"code_ji": "",
			"case_key": "",
			"change_description": "",
			"change_description_place": "Nové Město na Moravě",
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
		key: 5646545642,
		data: {
			"submit_date": "2017-05-22T14:33:59Z",
			"code_dpb": "17/554/EPU/1/0055949",
			"code_ji": "",
			"case_key": "",
			"change_description": "",
			"change_description_place": "Nové Mlýny",
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
		key: 5646545643,
		data: {
			"submit_date": "2017-06-12T15:05:41Z",
			"code_dpb": "16/219/EPU/2/0013126",
			"code_ji": "",
			"case_key": "",
			"change_description": "",
			"change_description_place": "Praha",
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
		key: 5646545644,
		data: {
			"submit_date": "2017-06-13T15:12:11Z",
			"code_dpb": "16/219/EPU/2/1478456",
			"code_ji": "",
			"case_key": "",
			"change_description": "",
			"change_description_place": "Nová Role",
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
		key: 5646545641,
		data: {
			"lpis_case_id": 5646545641,
			"status": "created",
			"date": "2018-07-18T14:33:59Z",
			"changed_by": 1
		}
	}, {
		key: 5646545642,
		data: {
			"lpis_case_id": 5646545641,
			"status": "prepared",
			"date": "2018-07-18T17:33:59Z",
			"changed_by": 2
		}
	}, {
		key: 5646545643,
		data: {
			"lpis_case_id": 5646545642,
			"status": "created",
			"date": "2018-12-22T16:33:59Z",
			"changed_by": 2
		}
	}, {
		key: 5646545644,
		data: {
			"lpis_case_id": 5646545643,
			"status": "created",
			"date": "2018-12-22T16:33:57Z",
			"changed_by": 1
		}
	}, {
		key: 5646545645,
		data: {
			"lpis_case_id": 5646545643,
			"status": "prepared",
			"date": "2018-12-23T17:34:57Z",
			"changed_by": 2
		}
	}, {
		key: 5646545646,
		data: {
			"lpis_case_id": 5646545643,
			"status": "approved",
			"date": "2018-12-26T07:25:04Z",
			"changed_by": 3
		}
	}, {
		key: 5646545647,
		data: {
			"lpis_case_id": 5646545644,
			"status": "created",
			"date": "2018-10-27T16:54:57Z",
			"changed_by": 18
		}
	}]
};

function receiveCases(state, action) {
	let data;
	if (state.cases && state.cases.length) {
		// remove old versions of received models
		let oldData = _.reject(state.cases, model => {
			return _.find(action.data, {key: model.key});
		});
		data = [...oldData, ...action.data];
	} else {
		data = [...action.data];
	}
	return {...state, loading: false, cases: data};
}

function receiveChanges(state, action) {
	let data;
	if (state.changes && state.changes.length) {
		// remove old versions of received models
		let oldData = _.reject(state.changes, model => {
			return _.find(action.data, {key: model.key});
		});
		data = [...oldData, ...action.data];
	} else {
		data = [...action.data];
	}
	return {...state, loading: false, changes: data};
}

function changeSearchString(state, action) {
	return {
		...state,
		searchString: action.searchString
	}
}

function createNewActiveEditedCase(state, action) {
	let uuid = utils.guid();
	return {
		...state,
		activeNewEditedCaseKey: uuid,
		editedCases: [
			...state.editedCases,
			{
				key: uuid,
				data: {},
				files: {}
			}
		]
	}
}

function editActiveEditedCase(state, action) {
	let column = action.column;
	let value = action.value;
	let file = action.file;

	let editedCases = [];

	state.editedCases.forEach((editedCase) => {
		if(editedCase.key === state.activeNewEditedCaseKey) {
			let files = {...editedCase.files};
			if(column.toLowerCase().includes(`geometry`) && editedCase.data[column] && file) {
				let oldGeometryFileIdentifier = editedCase.data[column].identifier;
				delete files[oldGeometryFileIdentifier];
			}

			editedCases.push(
				{
					...editedCase,
					data: {
						...editedCase.data,
						[column]: value
					},
					files: (file ? {...files, [file.identifier]: file.file} : editedCase.files)
				}
			)
		} else {
			editedCases.push(editedCase)
		}
	});

	return {
		...state,
		editedCases: editedCases
	};
}

function removeEditedCasesByKeys(state, action) {
	let keys = action.keys;

	let filteredEditedCases = [];
	state.editedCases.forEach((editedCase) => {
		if(!keys.includes(editedCase.key)) {
			filteredEditedCases.push(editedCase);
		}
	});

	return {
		...state,
		editedCases: filteredEditedCases,
		activeNewEditedCaseKey: keys.includes(state.activeNewEditedCaseKey) ? null : state.activeNewEditedCaseKey
	}
}

function setActive(state, action) {
	return {...state, activeCaseKey: action.key};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.LPIS_CASES_ADD:
			return receiveCases(state, action);
		case ActionTypes.LPIS_CASE_CHANGES_ADD:
			return receiveChanges(state, action);
		case ActionTypes.LPIS_CASES_SEARCH_STRING_CHANGE:
			return changeSearchString(state, action);
		case ActionTypes.LPIS_CASES_EDIT_ACTIVE_EDITED_CASE:
			return editActiveEditedCase(state, action);
		case ActionTypes.LPIS_CASES_CREATE_NEW_ACTIVE_EDITED_CASE:
			return createNewActiveEditedCase(state, action);
		case ActionTypes.LPIS_CASES_REMOVE_EDITED_CASES_BY_KEYS:
			return removeEditedCasesByKeys(state, action);
			case ActionTypes.LPIS_CASES_SET_ACTIVE:
			return setActive(state, action);
		default:
			return state;
	}
}
