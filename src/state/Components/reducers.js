import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';
import Names from '../../constants/Names';

const INITIAL_STATE = {
};

function update(state, action) {
	return {...state, [action.component]: state[action.component] ? {...state[action.component], ...action.update} : action.update};
}


/**
 * TODO refactor
 * action.layersTreeKey
 * action.update
 * 
 */
function updateLayerTree(state, action) {
	const layersTreesInitialized = Object.keys(state).includes('layersTrees');
	if (!layersTreesInitialized) {
		state = {...state, layersTrees: {}}
	}
	const layersTreeKey = action.layersTreeKey;
	const layersTreeKeyInitialized = Object.keys(state.layersTrees).includes(layersTreeKey);
	if (!layersTreeKeyInitialized) {
		state = {...state, layersTrees: {...state.layersTrees, [layersTreeKey]: {}}}
	}

	return {...state, layersTrees: {...state.layersTrees, [layersTreeKey]: action.update}};
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ActionTypes.COMPONENTS.UPDATE:
			return update(state, action);
		default:
			return state;
	}
}
