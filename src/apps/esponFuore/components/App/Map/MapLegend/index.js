import { connect } from 'react-redux';
import Select from '../../../../../../state/Select';
import Action from "../../../../../../state/Action";
import React from "react";
import { quartilePercentiles, mergeAttributeStatistics, getMiddleClassValues, getClassesIntervals, setClassesMinMaxFromStatistics } from '../../../../../../utils/statistics';
import { getIntervalTitle } from '../../../../../../utils/legend';
import { getPolygonImageByAttribution } from '../../../../../../components/common/maps/Deprecated_WorldWindMap/legend/legend'
import { DEFAULTFILLTRANSPARENCY } from '../../../../../../components/common/maps/Deprecated_WorldWindMap/styles/colors'
import {getCartogramStyleFunction} from '../../../../../../components/common/maps/Deprecated_WorldWindMap/styles/cartogram';
import {getCartodiagramStyleFunction} from '../../../../../../components/common/maps/Deprecated_WorldWindMap/styles/cartodiagram';
import {cloneDeep} from 'lodash';

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	const layersState = Select.maps.getLayersStateByMapSetKey_deprecated(state, ownProps.mapSetKey);

	const mapSetsLayers = {};
	for (const [key, value] of Object.entries(layersState)) {
		if(value && value.length && value.length > 0) {
			const layersData = value.map((l) => {
				const filter = cloneDeep(l.mergedFilter);
				return {filter, data: l.layer};
			});
			mapSetsLayers[key] = Select.maps.getLayers_deprecated(state, layersData);
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

	const choroplethLegend = [];

	for (const [layerTemplateKey, layerByLayerTemplateKey] of Object.entries(layersByLayerTemplateKey)) {
		if(layerByLayerTemplateKey.type === 'vector') {
			//get statistics for layertemplate
			layerByLayerTemplateKey.statistics = {};
		
			for (const [layerKey, layer] of Object.entries(layerByLayerTemplateKey.layers)) {
				if(layer.attributeRelationsData) {
					const attributeStatisticsFilter = {
						attributeDataSourceKey: {in: [layer.attributeRelationsData.attributeDataSourceKey]},
						percentile: quartilePercentiles,
					};
		
					const attributeStatistics = Select.attributeStatistics.getBatchByFilterOrder(state, attributeStatisticsFilter, null);
					layerByLayerTemplateKey.statistics[layerKey] = attributeStatistics && attributeStatistics[0] && attributeStatistics[0].attributeStatistic ? attributeStatistics[0] : null;

					if(layerByLayerTemplateKey.attributeKey !== layer.attributeRelationsData.attributeKey) {
						layerByLayerTemplateKey.attributeKey = layer.attributeRelationsData.attributeKey;
					}
				}
			}

			layerByLayerTemplateKey.mergedStatistics = mergeAttributeStatistics(Object.values(layerByLayerTemplateKey.statistics).filter(s => s));
			

			const choroplethLegendItem = {
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

					choroplethLegendItem.name = layerByLayerTemplateKey.attribute.data.nameDisplay;
					choroplethLegendItem.description = layerByLayerTemplateKey.attribute.data.description;

					//avoid clear values
					choroplethLegendItem.items = intervals.map((interval, index) => {
						const value = getMiddleClassValues(interval)[0];
						const attribution = styleFunction({userProperties:{tmpAttribute: value}})
						const first = index === 0;
						const title = getIntervalTitle(interval, first);
						return {
							title: title,
							image: getPolygonImageByAttribution(attribution)
						};
					});
					choroplethLegend.push(choroplethLegendItem);

					if (ownProps.showNoData) {
						const noDataValue = null;
						const noDataAttribution = styleFunction({userProperties:{tmpAttribute: noDataValue}});
						choroplethLegendItem.items.push(
								{
									title: 'No data',
									image: getPolygonImageByAttribution(noDataAttribution)
								}
						)
					}

				}else if(layerByLayerTemplateKey.attribute.data.valueType === 'absolute') {
					styleFunction = getCartodiagramStyleFunction(layerByLayerTemplateKey.attribute.data.color, DEFAULTFILLTRANSPARENCY, layerByLayerTemplateKey.mergedStatistics, 'tmpAttribute');
				}
			}
		}
	}

	let activeAttribute = Select.attributes.getActive(state);
	let legendType = activeAttribute && activeAttribute.data && activeAttribute.data.valueType;

	return {
		type: legendType,
		choroplethLegend: choroplethLegend
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		//TODO - load all we need
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
