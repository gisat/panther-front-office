import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import common, {DEFAULT_INITIAL_STATE} from '../../../../state/_common/reducers';
import utils from "../../../../utils/utils";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE,
	activeCaseKey: null,
	nextActiveCaseKey: null,
	searchString: null,
	selectedStatuses: null,
	activeNewEditedCaseKey: null,
	editedCases: [],
	cases: [],
	changes: []
};

function clearEditedCase(state, action) {
	let editedCase = _.find(state.editedCases, {key: action.key});
	let editedCases = _.reject(state.editedCases, {key: action.key});
	editedCase = {...editedCase, data: {}, files: {}};
	return {...state, editedCases: [...editedCases, editedCase]};
}

function clearActiveEditedCaseKey(state) {
	return {...state, activeNewEditedCaseKey: null, editedCases: []};
}

function editActiveEditedCase(state, action) {
	let editedCases = [];

	state.editedCases.forEach((editedCase) => {
		if (editedCase.key === state.activeNewEditedCaseKey) {
			let files = {...editedCase.files};
			const newFiles = action.files && action.files.reduce((acc, file) => {
				acc[file.identifier] = file.file
				return acc;
			}, {});
			//If colmn already includes file.
			if(newFiles && editedCase.data[action.column] && editedCase.data[action.column].identifiers){
				let oldGeometryFileIdentifiers = editedCase.data[action.column].identifiers;
				oldGeometryFileIdentifiers.forEach((i) => {
					delete files[i];
				})
			}

			let futureEditedCase = {...editedCase};

			if (action.status) {
				futureEditedCase.status = action.status;
			}

			if (action.column) {
				futureEditedCase.data[action.column] = action.value;
			}

			futureEditedCase.files = (action.files ? {...files, ...newFiles} : futureEditedCase.files);

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


function createNewActiveEditedCase(state, action) {
	let key = action.key || utils.guid();

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

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.LPIS_CHANGE_CASES_EDITED.CLEAR_EDITED_CASE:
			return clearEditedCase(state, action);
		case ActionTypes.LPIS_CHANGE_CASES_EDITED.EDIT_ACTIVE_EDITED_CASE:
			return editActiveEditedCase(state, action);
		case ActionTypes.LPIS_CHANGE_CASES_EDITED.CREATE_NEW_ACTIVE_EDITED_CASE:
			return createNewActiveEditedCase(state, action);
		case ActionTypes.LPIS_CHANGE_CASES_EDITED.CLEAR_ACTIVE_EDITED_CASE_KEY:
			return clearActiveEditedCaseKey(state);
	
		default:
			return state;
	}
}
