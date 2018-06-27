import ActionTypes from '../../constants/ActionTypes';
import Action from '../Action';
import _ from 'lodash';

import { combineReducers } from 'redux';
import vectorReducers from './vector/reducers';

const INITIAL_STATE = {
	data: [],
	loading: false
};

function receive(state, action) {
	let data;
	if (state.data && state.data.length) {
		// remove old versions of received models
		let oldData = _.reject(state.data, model => {
			return _.find(action.data, {key: model.key});
		});
		data = [...oldData, ...action.data];
	} else {
		data = [...action.data];
	}
	return {...state, loading: false, data: data};
}

function request(state, action) {
	return {...state, loading: true};
}

function requestFiltered(state, action) {
	console.log('#### SpatialDataSources/reducers#requestFiltered filter:', action.filter);
	return {...state, loading: true};
}

function requestError(state, action) {
	// message action
	return {...state, loading: false};
}

const reducers = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SPATIAL_DATA_SOURCES_RECEIVE:
			return receive(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES_REQUEST:
			return request(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES_FILTERED_REQUEST:
			return requestFiltered(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES_REQUEST_ERROR:
			return requestError(state, action);
		default:
			return state;
	}
};

export default combineReducers({
	main: reducers,
	vector: vectorReducers
});