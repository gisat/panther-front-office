import ActionTypes from '../../constants/ActionTypes';
import Select from '../Select';
import _ from 'lodash';

// ============ creators ===========
const updateChoropleth = (data) => {
	return (dispatch, getState) => {
		let key = `choropleth_attr_${data.attribute}_as_${data.attributeSet}`;
		let existingChoropleth = Select.choropleths.getByKey(getState(), key);

		let choropleth = {};
		let newDataForPeriod = {
			[data.period]: {
				period: data.period,
				sldId: data.sldId,
				layer: data.layer
			}
		};

		if (existingChoropleth){
			choropleth = {...existingChoropleth, byPeriod: {...existingChoropleth.byPeriod, ...newDataForPeriod}}
		} else {
			choropleth.key = key;
			choropleth.attribute = data.attribute;
			choropleth.attributeSet = data.attributeSet;
			choropleth.byPeriod = newDataForPeriod;
		}
		dispatch(actionUpdate([choropleth]));
	}
};

const addActiveKeys = (keys) => {
	return (dispatch, getState) => {
		if (!_.isArray(keys)) keys = [keys];
		let state = getState();
		let activeKeys = Select.choropleths.getActiveKeys(state);
		let updatedKeys = [];
		if (activeKeys){
			updatedKeys = [...activeKeys, ...keys];
		} else {
			updatedKeys = keys;
		}
		dispatch(actionSetActiveKeys(updatedKeys));
	}
};

const removeActiveKeys = (keys) => {
	return (dispatch, getState) => {
		if (!_.isArray(keys)) keys = [keys];
		let state = getState();
		let activeKeys = Select.choropleths.getActiveKeys(state);
		if (activeKeys){
			let updatedKeys = _.difference(activeKeys, keys);
			dispatch(actionSetActiveKeys(updatedKeys));
		}
	}
};

const removeAllActiveKeys = () => {
	return dispatch => {
		dispatch(actionSetActiveKeys(null));
	}
};

// ============ actions ===========
function actionUpdate(data){
	return {
		type: ActionTypes.CHOROPLETHS_UPDATE,
		data: data
	}
}

function actionSetActiveKeys(keys){
	return {
		type: ActionTypes.CHOROPLETHS_SET_ACTIVE_KEYS,
		keys: keys
	}
}


// ============ export ===========

export default {
	updateChoropleth,
	addActiveKeys,
	removeActiveKeys,
	removeAllActiveKeys
}
