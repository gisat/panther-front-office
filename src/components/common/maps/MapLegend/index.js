import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import React from "react";
import { quartilePercentiles, mergeAttributeStatistics, getMiddleClassValues, getClassesIntervals, setClassesMinMaxFromStatistics } from '../../../../utils/statistics';
import { getPolygonImageByAttribution } from '../../../../components/common/maps/WorldWindMap/legend/legend'
import { DEFAULTFILLTRANSPARENCY } from '../../../../components/common/maps/WorldWindMap/styles/colors'
import {getCartogramStyleFunction} from '../../../../components/common/maps/WorldWindMap/styles/cartogram';
import {getCartodiagramStyleFunction} from '../../../../components/common/maps/WorldWindMap/styles/cartodiagram';
import {cloneDeep} from 'lodash';

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	const layerTemplates = Select.maps.getLayerTemplatesKeysByMapSetKey(state, ownProps.mapSetKey);
	const layersState = Select.maps.getLayersStateByMapSetKey(state, ownProps.mapSetKey);

	const mapSetsLayers = {};
	for (const [key, value] of Object.entries(layersState)) {
		if(value && value.length & value.length > 0) {
			const layersData = value.map((l) => {
				const filter = cloneDeep(l.mergedFilter);
				return {filter, data: l.layer};
			})
			mapSetsLayers[key] = Select.maps.getLayers(state, layersData);
		}
	};

	const layersByLayerTemplateKey = {};
	for (const [mapKey, layers] of Object.entries(mapSetsLayers)) {
		for (const layer of layers) {
			const layerTemplateKey = layer.spatialRelationsData && layer.spatialRelationsData.layerTemplateKey;
			if(layerTemplateKey) {
				if(!layersByLayerTemplateKey[layerTemplateKey]) {
					layersByLayerTemplateKey[layerTemplateKey] = {};
					layersByLayerTemplateKey[layerTemplateKey] = {
						key: layerTemplateKey,
						attribute: null,
						type: layer.type,
						statistics: {},
						mergedStatistics: null,
						showInLegend: false,
						layers: {}
					};
				}
				layersByLayerTemplateKey[layerTemplateKey].layers[layer.key] = layer
			}
		}
	}

	const legend = [];

	for (const [layerTemplateKey, layerByLayerTemplateKey] of Object.entries(layersByLayerTemplateKey)) {
		if(layerByLayerTemplateKey.type === 'vector') {
			//get statistics for layertemplate
			layerByLayerTemplateKey.statistics = {};
		
			for (const [layerKey, layer] of Object.entries(layerByLayerTemplateKey.layers)) {
				if(layer.attributeRelationsData) {
					const attributeStatisticsFilter = {
						attributeDataSourceKey: layer.attributeRelationsData.attributeDataSourceKey,
						percentile: quartilePercentiles,
					};
		
					const attributeStatistics = Select.attributeStatistics.getBatchByFilterOrder(state, attributeStatisticsFilter, null);
					layerByLayerTemplateKey.statistics[layerKey] = attributeStatistics && attributeStatistics[0] && attributeStatistics[0].attributeStatistic ? attributeStatistics[0] : null;

					if(layerByLayerTemplateKey.attributeKey !== layer.attributeRelationsData.attributeKey) {
						layerByLayerTemplateKey.attributeKey = layer.attributeRelationsData.attributeKey;
					};
				}
			}

			layerByLayerTemplateKey.mergedStatistics = mergeAttributeStatistics(Object.values(layerByLayerTemplateKey.statistics).filter(s => s));
			

			const legendItem = {
				name: null,
				items: []
			};

			if(layerByLayerTemplateKey.attributeKey) {
				layerByLayerTemplateKey.attribute = Select.attributes.getByKey(state, layerByLayerTemplateKey.attributeKey);

				let styleFunction;
				if(layerByLayerTemplateKey.attribute.data.valueType === 'relative') {
					styleFunction = getCartogramStyleFunction(layerByLayerTemplateKey.attribute.data.color, DEFAULTFILLTRANSPARENCY, layerByLayerTemplateKey.mergedStatistics, 'tmpAttribute');
					const classes = setClassesMinMaxFromStatistics(layerByLayerTemplateKey.mergedStatistics.percentile, layerByLayerTemplateKey.mergedStatistics);
					const intervals = getClassesIntervals(classes);
					
					legendItem.name = layerByLayerTemplateKey.attribute.data.nameDisplay;

					//avoid clear values
					legendItem.items = intervals.map(interval => {
						const value = getMiddleClassValues(interval)[0];
						const attribution = styleFunction({userProperties:{tmpAttribute: value}})
						const title = interval[1] === interval[0] ? Math.round(interval[0] * 100) : `${Math.round(interval[0] * 100) / 100} - ${Math.round(interval[1] * 100) / 100}`;
						return {
								title: `${Math.round(interval[0] * 100) / 100} - ${Math.round(interval[1] * 100) / 100}`,
								image: getPolygonImageByAttribution(attribution)
						}
					});
					legend.push(legendItem);

				}else if(layerByLayerTemplateKey.attribute.data.valueType === 'absolute') {
					styleFunction = getCartodiagramStyleFunction(layerByLayerTemplateKey.attribute.data.color, DEFAULTFILLTRANSPARENCY, layerByLayerTemplateKey.mergedStatistics, 'tmpAttribute');
				}
			}
		}
	}
	
	return {
		legendItems: legend,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		//TODO - load all we need
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
