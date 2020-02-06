import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import datesHelpers from '../helpers/dates';
import mapHelpers from '../../../../utils/map';

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
	return datesHelpers.getDates(geometry).then((responseContent) => {
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

const ensureDatesForMapSetExtent = (mapSet) => {
	const view = mapSet.data.view;
	//get boundary geojson
	const boundingGeometry = mapHelpers.getGeometryFromView(view);
	return datesHelpers.getDates(boundingGeometry).then(results => ({dates:results.dates, boundingGeometry}));
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

const actionUpdate = (data) => {
	return {
		type: ActionTypes.LPIS_CHANGE_DATES.UPDATE,
		data
	}
};

function updateStateFromView(data) {
	return dispatch => {
		if (data) {
			dispatch(actionUpdate(data));
		}
	};
}

// ============ export ===========

export default {
	ensureDatesForActiveCase,
	ensureDatesForMapSetExtent,
	getDates,
	loadDatesForActiveCase,
	updateStateFromView,
}