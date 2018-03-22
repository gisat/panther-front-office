import {createSelector} from 'reselect';
import _ from 'lodash';
import LayerPeriods from '../LayerPeriods/selectors';

const getLayers = state => state.wmsLayers.data;

const getLayersWithAoiPeriods = createSelector(
	[getLayers, LayerPeriods.getActiveAoiData],
	(layers, activeAoiLayerPeriods) => {
		return _.map(layers, layer => {
			return {...layer, periods: activeAoiLayerPeriods && activeAoiLayerPeriods.byLayerKey[layer.key]}
		});
	}
);

export default {
	getLayersWithAoiPeriods: getLayersWithAoiPeriods
};