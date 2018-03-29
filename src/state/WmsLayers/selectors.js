import {createSelector} from 'reselect';
import _ from 'lodash';
import LayerPeriods from '../LayerPeriods/selectors';
import Scope from '../Scopes/selectors';

const getAllLayers = state => state.wmsLayers.data;

const getLayers = createSelector(
	[getAllLayers, Scope.getActiveScopeKey],
	(layers, activeScopeKey) => {
		return _.filter(layers, layer => {
			return layer.scope === activeScopeKey;
		});
	}
);

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