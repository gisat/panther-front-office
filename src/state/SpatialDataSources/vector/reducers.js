import ActionTypes from '../../../constants/ActionTypes';
import Action from '../../Action';
import _ from 'lodash';

const INITIAL_STATE = {
	featuresBySourceKey: {},
	editedFeaturesBySourceKey: {},
	selectedFeaturesKeysBySourceKey: {},
	loading: false
};

function receive(state, action) {
	let data;
	if (state.featuresBySourceKey.hasOwnProperty(action.dataSourceKey) && state.featuresBySourceKey[action.dataSourceKey].length) {
		// remove old versions of received models
		let oldData = _.reject(state.featuresBySourceKey[action.dataSourceKey], model => {
			return _.find(action.data, {key: model.key});
		});
		data = [...oldData, ...action.data];
	} else {
		data = [...action.data];
	}
	return {...state, loading: false, featuresBySourceKey: {...state.featuresBySourceKey, [action.dataSourceKey]: data}};
}

function select(state, action) {
	let selectedKeys = state.selectedFeaturesKeysBySourceKey[action.dataSourceKey] || [];
	switch (action.selectionMode) {
		case 'replace':
			selectedKeys = action.featureKeys;
			break;
		case 'add':
			selectedKeys = _.uniq([...selectedKeys, ...action.featureKeys]);
			break;
		case 'remove':
			selectedKeys = _.without(selectedKeys, action.featureKeys);
			break;
	}
	return {...state, selectedFeaturesKeysBySourceKey: {...state.selectedFeaturesKeysBySourceKey, [action.dataSourceKey]: selectedKeys}}
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_RECEIVE:
			return receive(state, action);
		case ActionTypes.SPATIAL_DATA_SOURCES_VECTOR_FEATURES_SELECT:
			return select(state, action);
		default:
			return state;
	}
}