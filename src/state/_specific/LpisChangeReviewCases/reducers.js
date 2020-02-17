import ActionTypes from '../../../constants/ActionTypes';
import _ from 'lodash';
import {utils} from "panther-utils"

const INITIAL_STATE = {
	activeCaseKey: null,
	nextActiveCaseKey: null,
	searchString: null,
	selectedStatuses: null,
	activeNewEditedCaseKey: null,
	editedCases: [],
	cases: [],
	changes: []
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

function changeSelectedStatuses(state, action) {
	return {
		...state,
		selectedStatuses: action.selectedStatuses
	}
}

function createNewActiveEditedCase(state, action) {
	let key = action.key || utils.uuid();

	let futureEditedCase = {
		key: key,
		data: {}
	};

	if(action.status) {
		futureEditedCase.status = action.status;
	}

	if (action.column) {
		futureEditedCase.data[action.column] = action.value;
	}

	return {
		...state,
		activeNewEditedCaseKey: key,
		editedCases: [
			...state.editedCases,
			futureEditedCase
		]
	}
}

function editActiveEditedCase(state, action) {
	let editedCases = [];

	state.editedCases.forEach((editedCase) => {
		if (editedCase.key === state.activeNewEditedCaseKey) {
			let files = {...editedCase.files};
			if (action.column && action.column.toLowerCase().includes(`geometry`) && editedCase.data[action.column] && action.file) {
				let oldGeometryFileIdentifier = editedCase.data[action.column].identifier;
				delete files[oldGeometryFileIdentifier];
			}

			let futureEditedCase = {...editedCase};

			if (action.status) {
				futureEditedCase.status = action.status;
			}

			if (action.column) {
				futureEditedCase.data[action.column] = action.value;
			}

			futureEditedCase.files = (action.file ? {...files, [action.file.identifier]: action.file.file} : futureEditedCase.files);

			if (!futureEditedCase.files || !Object.keys(futureEditedCase.files).length) {
				delete futureEditedCase.files;
			}

			editedCases.push(futureEditedCase);
		} else {
			editedCases.push(editedCase)
		}
	});

	return {
		...state,
		editedCases: editedCases
	};
}

function clearEditedCase(state, action) {
	let editedCase = _.find(state.editedCases, {key: action.key});
	let editedCases = _.reject(state.editedCases, {key: action.key});
	editedCase = {...editedCase, data: {}};
	editedCases = {...editedCases, editedCase};
	return {...state, editedCases: editedCases};
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

function setNextActiveCaseKey(state, action) {
	return {
		...state,
		nextActiveCaseKey: action.key
	}
}

function editActiveCase(state, action) {
	let activeCaseKey = state.activeCaseKey;
	let activeCase = _.find(state.cases, {key: activeCaseKey});
	let activeCaseEdited = _.find(state.editedCases, {key: activeCaseKey});
	let oldEditedCases = _.reject(state.editedCases, {key: activeCaseKey});
	return {
		...state,
		editedCases: [
			...oldEditedCases,
			{
				key: activeCaseKey,
				data: activeCaseEdited ? {
					...activeCaseEdited.data,
					[action.property]: action.value
				} : {
					[action.property]: action.value
				}
			}
		]
	};
}

function editActiveCaseStatus(state, action) {
	let activeCaseKey = state.activeCaseKey;
	let activeCase = _.find(state.cases, {key: activeCaseKey});
	let activeCaseEdited = _.find(state.editedCases, {key: activeCaseKey});
	let oldEditedCases = _.reject(state.editedCases, {key: activeCaseKey});
	return {
		...state,
		editedCases: [
			...oldEditedCases,
			{
				key: activeCaseKey,
				data: activeCaseEdited ? activeCaseEdited.data : {},
				status: action.status
			}
		]
	};
}

function editCaseStatus(state, action) {
	let caseEdited = _.find(state.editedCases, {key: action.key});
	let oldEditedCases = _.reject(state.editedCases, {key: action.key});
	return {
		...state,
		editedCases: [
			...oldEditedCases,
			{
				key: action.key,
				data: caseEdited ? caseEdited.data : {},
				status: action.status
			}
		]
	};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.LPIS_CASES_ADD:
			return receiveCases(state, action);
		case ActionTypes.LPIS_CASE_CHANGES_ADD:
			return receiveChanges(state, action);
		case ActionTypes.LPIS_CASES_SEARCH_STRING_CHANGE:
			return changeSearchString(state, action);
		case ActionTypes.LPIS_CASES_SELECTED_STATUS_CHANGE:
			return changeSelectedStatuses(state, action);
		case ActionTypes.LPIS_CASES_EDIT_ACTIVE_EDITED_CASE:
			return editActiveEditedCase(state, action);
		case ActionTypes.LPIS_CASES_CREATE_NEW_ACTIVE_EDITED_CASE:
			return createNewActiveEditedCase(state, action);
		case ActionTypes.LPIS_CASES_REMOVE_EDITED_CASES_BY_KEYS:
			return removeEditedCasesByKeys(state, action);
		case ActionTypes.LPIS_CASES_SET_ACTIVE:
			return setActive(state, action);
		case ActionTypes.LPIS_CASES_CLEAR_EDITED_CASE:
			return clearEditedCase(state, action);
		case ActionTypes.LPIS_CASE_EDIT_ACTIVE_CASE:
			return editActiveCase(state, action);
		case ActionTypes.LPIS_CASE_EDIT_ACTIVE_CASE_STATUS:
			return editActiveCaseStatus(state, action);
		case ActionTypes.LPIS_CASE_SET_NEXT_ACTIVE_CASE_KEY:
			return setNextActiveCaseKey(state, action);
		case ActionTypes.LPIS_CASE_EDIT_CASE_STATUS:
			return editCaseStatus(state, action);
		default:
			return state;
	}
}
