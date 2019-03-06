import ActionTypes from '../../../constants/ActionTypes';
import _ from 'lodash';
import common from '../../_common/reducers';

import {DEFAULT_INITIAL_STATE} from "../../_common/reducers";

const INITIAL_STATE = {
	...DEFAULT_INITIAL_STATE,
	...{
		activeCaseKey: null,
		cases: [],
		searchString: '',
		filterVisited: 'all',
		filterConfirmed: 'all',
		changingActive: false,
	}
};

function changeSearch(state, action) {
	return {
		...state,
		[action.searchParam.name]: action.searchParam.value
	}
}

function setChangingActive(state, action) {
	return {
		...state,
		changingActive: action.value
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
		case ActionTypes.LPISCHECK_UPDATE_CASE:
			return updateCase(state, action);
		case ActionTypes.LPISCHECK_CASES_SET_ACTIVE:
			return setActiveCase(state, action);
		case ActionTypes.LPIS_CHECK_CASES_SEARCH_PARAM_CHANGE:
			return changeSearch(state, action);
		case ActionTypes.LPIS_CHECK_CASES_SET_CHANGING_ACTIVE:
			return setChangingActive(state, action);
		case ActionTypes.LPIS_CASES.ADD:
			return common.add(state, action);
		case ActionTypes.LPIS_CASES.ADD_UNRECEIVED:
			return common.addUnreceivedKeys(state, action);
		case ActionTypes.LPIS_CASES.INDEX.ADD:
			return common.addIndex(state, action);
		case ActionTypes.LPIS_CASES_REMOVE:
			return common.remove(state, action);
		case ActionTypes.LPIS_CASES.SET_ACTIVE_KEY:
			return common.setActive(state, action);
		case ActionTypes.LPIS_CASES.USE.INDEXED.REGISTER:
			return common.registerUseIndexed(state, action);
		case ActionTypes.LPIS_CASES.USE.INDEXED.CLEAR:
			return common.useIndexedClear(state, action);
		case ActionTypes.LPIS_CASES.USE.KEYS.REGISTER:
			return common.useKeysRegister(state, action);
		case ActionTypes.LPIS_CASES.USE.KEYS.CLEAR:
			return common.useKeysClear(state, action);
		case ActionTypes.LPIS_CASES.INDEX.CLEAR_ALL:
			return common.clearIndexes(state, action);
		case ActionTypes.COMMON.DATA.SET_OUTDATED:
			return common.dataSetOutdated(state, action);
		case ActionTypes.COMMON.DATA.CLEANUP_ON_LOGOUT:
			return common.cleanupOnLogout(state, action);
		default:
			return state;
	}
}
