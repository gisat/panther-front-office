import ActionTypes from '../../../constants/ActionTypes';
import Action from '../../Action';
import _ from 'lodash';

const INITIAL_STATE = {
	features: [],
	editedFeatures: [],
	loading: false
};

function receive(state, action) {
	let data;
	if (state.features && state.features.length) {
		// remove old versions of received models
		let oldData = _.reject(state.features, model => {
			return _.find(action.data, {key: model.key});
		});
		data = [...oldData, ...action.data];
	} else {
		data = [...action.data];
	}
	return {...state, loading: false, features: data};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_RECEIVE:
			return receive(state, action);
		default:
			return state;
	}
}