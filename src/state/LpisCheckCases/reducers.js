import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	activeCaseKey: null,
	cases: [],
	searchString: '',
	filterVisited: 'all',
	filterConfirmed: 'all',
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

function changeSearch(state, action) {
	return {
		...state,
		[action.searchParam.name]: action.searchParam.value
	}
}

function setActiveCase(state, action) {
	return {...state, activeCaseKey: action.key};
}

function updateCase(state, action) {
	const casekey = action.lpisCase.key;
	const caseindex = state.cases.findIndex(c => c.key === casekey);
	if (caseindex > -1) {
		return {...state, cases: state.cases.map((c,index) => {
			if(index !== caseindex) {
				return c;
			} else {
				return {...c, ...action.lpisCase, data: {...c.data, ...action.lpisCase.data}};
			}
		})}
	} else {
		return state;
	}
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.LPISCHECK_CASES_ADD:
			return receiveCases(state, action);
		case ActionTypes.LPISCHECK_UPDATE_CASE:
			return updateCase(state, action);
		case ActionTypes.LPISCHECK_CASES_SET_ACTIVE:
			return setActiveCase(state, action);
		case ActionTypes.LPIS_CHECK_CASES_SEARCH_PARAM_CHANGE:
			return changeSearch(state, action);
		default:
			return state;
	}
}
