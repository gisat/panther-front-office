import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";
import createCachedSelector from "re-reselect";

const getSubstate = state => state.styles;

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);

const getGroupedByLayerKey = createCachedSelector(
	[
		getAllAsObject,
		(state, layersState) => layersState
	],
	(styles, layersState) => {
		if (styles && !_.isEmpty(styles) && layersState) {
			let stylesByLayerKey = {};
			layersState.forEach(layer => {
				if (layer.styleKey) {
					stylesByLayerKey[layer.key] = styles[layer.styleKey];
				}
			});

			return stylesByLayerKey;
		} else {
			return null;
		}
	}
)((state, layerState) => JSON.stringify(layerState));

export default {
	getAll,
	getByKey: common.getByKey(getSubstate),

	getGroupedByLayerKey,
	getSubstate
};