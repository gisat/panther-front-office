import {createSelector} from 'reselect';

// const getLayersTrees = state => state.components.layersTrees;

const getAllByKey = (state) => state.components;

const getDataByComponentKey = createSelector(
	[
		getAllByKey,
		(state, key) => key
	],
	(components, key) => {
		if (components && key && components[key]) {
			return components[key];
		} else {
			return null;
		}
	}
);

export default {
	getDataByComponentKey
}
