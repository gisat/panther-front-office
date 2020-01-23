import {createSelector} from 'reselect';
import LpisChangeCasesSelectors from '../LpisChangeCases/selectors';

const getSubstate = state => state.specific.lpisChangeDates;

const getDates = (state, caseKey) => {
	const substate = getSubstate(state);
	return substate.dates[caseKey];
}

const getDatesForActiveCase = (state) => {
	const activeCase = LpisChangeCasesSelectors.getActive(state);
	return getDates(state, activeCase.key);
}

export default {
	getDates,
	getDatesForActiveCase,
	getSubstate,
};