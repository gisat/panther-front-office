import {createSelector} from 'reselect';
import _ from 'lodash';
import LayerPeriods from '../LayerPeriods/selectors';
import Scope from '../Scopes/selectors';
import Period from '../Periods/selectors';

const getAllLayers = state => state.wmsLayers.data;

const getLayers = createSelector(
	[getAllLayers, Scope.getActiveScopeKey, Period.getPeriods],
	(layers, activeScopeKey, periods) => {
		layers =  _.filter(layers, layer => {
			return layer.scope === activeScopeKey;
		});
		return _.map(layers, layer => {
			if (layer.periods && layer.periods.length) {
				let layerPeriods = _.map(layer.periods, layerPeriod => {
					if (_.isNumber(layerPeriod) && periods && periods.length) {
						// metadata period key
						let period = _.find(periods, {key: layerPeriod});
						return period ? period.period : null;
					} else {
						// period string
						return layerPeriod;
					}
				});
				if (layerPeriods.length) {
					return {...layer, periods: {data: layerPeriods}};
				}
			}
			return layer;
		});
	}
);

const getLayersWithAoiPeriods = createSelector(
	[getLayers, LayerPeriods.getActiveAoiData],
	(layers, activeAoiLayerPeriods) => {
		return _.map(layers, layer => {
			let aoiPeriods = activeAoiLayerPeriods && activeAoiLayerPeriods.byLayerKey[layer.key];
			if (aoiPeriods && aoiPeriods.data && aoiPeriods.data.length) {
				return {...layer, periods: aoiPeriods};
			}
			return layer
		});
	}
);

export default {
	getLayers: getLayers,
	getLayersWithAoiPeriods: getLayersWithAoiPeriods
};