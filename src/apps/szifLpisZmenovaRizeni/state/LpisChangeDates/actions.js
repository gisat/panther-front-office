import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';

// ============ creators ===========
// ============ actions ===========
const saveDates = (key, dates) => {
	return {
		type: ActionTypes.LPIS_CHANGE_DATES.SAVE_DATES,
		key,
		dates,
	}
}

const getDates = (key, geometry) => (dispatch, getState) => {
	//pokud neni pod klícem geometrie, tak stáhnout

	const url = 'http://dromas.gisat.cz/backend/rest/imagemosaic/getDates';
	const data = {data: {
		geometry
	}};

	return fetch(url, {
		method: 'POST',
		// credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then(response => {
		if (response.status === 200) {
			return response.json();
		}
	}).then((responseContent) => {
		// dispatch(LpisChangeCasesActions.clearIndex(null, [['submitDate', 'descending']]))
		dispatch(saveDates(key, responseContent.dates));
	});
}

const loadDatesForActiveCase = () => (dispatch, getState) => {
	const state = getState();
	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	const activeCaseKey = activeCase.key;
	const geometryBefore = activeCase.data.geometryBefore;
	const geometryAfter = activeCase.data.geometryAfter;
	const geometry = geometryBefore || geometryAfter;

	//set loading true
	dispatch(getDates(activeCaseKey, JSON.parse(geometry))).then(() => {
		//set loading false
	});
}

const ensureDatesForActiveCase = () => (dispatch, getState) => {
	const state = getState();
	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	const activeCaseKey = activeCase.key;
	const dates = Select.specific.lpisChangeDates.getDates(state, activeCaseKey);
	if(!dates) {
		return dispatch(loadDatesForActiveCase());
	}
}
// ============ export ===========

export default {
	ensureDatesForActiveCase,
	getDates,
	loadDatesForActiveCase,
}