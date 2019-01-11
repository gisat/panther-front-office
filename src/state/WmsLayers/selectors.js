import {createSelector} from 'reselect';
import _ from 'lodash';
import common from "../_common/selectors";

import LayerPeriods from '../LayerPeriods/selectors';
import Scope from '../Scopes/selectors';
import Period from '../Periods/selectors';

const getSubstate = state => state.wmsLayers;

const getAll = common.getAll(getSubstate);

const getLayers = createSelector(
	[getAll, Scope.getActiveScopeKey, Period.getPeriods],
	(layers, activeScopeKey, periods) => {
		layers =  _.filter(layers, layer => {
			return layer.data.scope === activeScopeKey;
		});
		return _.map(layers, layer => {
			if (layer.data.periods && layer.data.periods.length) {
				let layerPeriods = _.map(layer.data.periods, layerPeriod => {
					if (_.isNumber(layerPeriod) && periods && periods.length) {
						// metadata period key
						let period = _.find(periods, {key: layerPeriod});
						return period ? period.data.period : null;
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

const getLayersWithGetDate = createSelector(
	[getAll],
	(layers) => {
		if (layers && layers.length){
			let filteredLayers = _.filter(layers, (layer) => {
				return !!layer.data.get_date;
			});
			return filteredLayers.length ? filteredLayers : null;
		} else {
			return null;
		}
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

const getLayersWithPlacePeriods = createSelector(
	[getLayers, LayerPeriods.getActivePlaceData],
	(layers, activePlaceLayerPeriods) => {
		return _.map(layers, layer => {
			let placePeriods = activePlaceLayerPeriods && activePlaceLayerPeriods.byLayerKey[layer.key];
			if (placePeriods && placePeriods.data && placePeriods.data.length) {
				return {...layer, periods: placePeriods};
			}
			return layer
		});
	}
);

const getLayersWithLpisCasePeriods = createSelector(
	[getLayers, LayerPeriods.getForActiveLpisCase],
	(layers, activeLpisCaseLayerPeriods) => {
		return _.map(layers, layer => {
			let casePeriods = activeLpisCaseLayerPeriods && activeLpisCaseLayerPeriods.byLayerKey[layer.key];
			if (casePeriods && casePeriods.data && casePeriods.data.length) {
				return {...layer, periods: casePeriods};
			}
			return layer
		});
	}
);

export default {
	getLayers,
	getLayersWithAoiPeriods,
	getLayersWithPlacePeriods,
	getLayersWithLpisCasePeriods,

	getLayersWithGetDate,
	getSubstate
};