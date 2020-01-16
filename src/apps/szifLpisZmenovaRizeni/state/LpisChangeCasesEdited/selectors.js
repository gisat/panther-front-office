import {createSelector} from 'reselect';
import _ from 'lodash';
import common from "../../../../state/_common/selectors";

const getSubstate = state => state.specific.lpisChangeCasesEdited;
const getActiveEditedCaseKey = state => state.specific.lpisChangeCasesEdited.activeNewEditedCaseKey;
const getEditedCases = state => state.specific.lpisChangeCasesEdited.editedCases;

const getActiveEditedCase = createSelector(
	[getActiveEditedCaseKey, getEditedCases],
	(activeEditedCaseKey, editedCases) => {
		return _.find(editedCases, {key: activeEditedCaseKey});
	}
);

export default {
	getSubstate,
	getActiveEditedCaseKey,
	getActiveEditedCase,
};