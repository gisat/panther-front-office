import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../../../state/Action";
import React from "react";
import { quartilePercentiles, mergeAttributeStatistics, getMiddleClassValues, getClassesIntervals, setClassesMinMaxFromStatistics, getMinMaxCenterValueClassesByStatistics } from '../../../../../../utils/statistics';
import { getIntervalTitle } from '../../../../../../utils/legend';
import { getPolygonImageByAttribution } from '../../../../../../components/common/maps/Deprecated_WorldWindMap/legend/legend'
import { DEFAULTFILLTRANSPARENCY } from '../../../../../../components/common/maps/Deprecated_WorldWindMap/styles/colors'
import {getCartogramStyleFunction, getTwoColoredCartogramStyleFunction} from '../../../../../../components/common/maps/Deprecated_WorldWindMap/styles/cartogram';
import {cloneDeep} from 'lodash';

import presentation from './presentation';
import helpers from './helpers';
import fuoreUtils from "../../../../utils";

const mapStateToProps = (state, ownProps) => {
	let legendType = null;
	let navigatorRange = Select.maps.getMapSetNavigatorRange_deprecated(state, ownProps.mapSetKey);
	const layersState = Select.maps.getLayersStateByMapSetKey_deprecated(state, ownProps.mapSetKey);

	let activeIndicatorKey = Select.components.get(state, 'esponFuore_IndicatorSelect', 'activeIndicator');
	let activeIndicator = Select.specific.esponFuoreIndicators.getByKey(state, activeIndicatorKey);

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

	let choroplethLegendData = [];
	let diagramLegendData = [];

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
				const attribute = Select.attributes.getByKey(state, layerByLayerTemplateKey.attributeKey);
				layerByLayerTemplateKey.attribute = attribute;
				legendType = layerByLayerTemplateKey.attribute && layerByLayerTemplateKey.attribute.data && layerByLayerTemplateKey.attribute.data.valueType;

				const color = fuoreUtils.resolveColour(attribute);

				let styleFunction;
				if(layerByLayerTemplateKey.attribute.data.valueType === 'relative') {
					let classes;
					if(activeIndicator.data.twoSideScale === true) {
						const classCount = 3;
						const colors = [...fuoreUtils.resolveColours(activeIndicator), '#ffffff']; //#ffffff - center color
						const highColor = colors[0];
						const lowColor = colors[1];
						const centerColor = colors[2];	
						styleFunction = getTwoColoredCartogramStyleFunction(highColor, lowColor, centerColor, classCount, DEFAULTFILLTRANSPARENCY, layerByLayerTemplateKey.mergedStatistics, 'tmpAttribute');
						classes = getMinMaxCenterValueClassesByStatistics(layerByLayerTemplateKey.mergedStatistics, classCount);
					} else {
						styleFunction = getCartogramStyleFunction(color, DEFAULTFILLTRANSPARENCY, layerByLayerTemplateKey.mergedStatistics, 'tmpAttribute');
						classes = setClassesMinMaxFromStatistics(layerByLayerTemplateKey.mergedStatistics.percentile, layerByLayerTemplateKey.mergedStatistics);
					}
					classes.sort((a, b) => b - a);
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
					choroplethLegendData.push(choroplethLegendItem);

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

				} else if(layerByLayerTemplateKey.attribute.data.valueType === 'absolute') {
					let minValue = layerByLayerTemplateKey.mergedStatistics && layerByLayerTemplateKey.mergedStatistics.min;
					let maxValue = layerByLayerTemplateKey.mergedStatistics && layerByLayerTemplateKey.mergedStatistics.max;
					diagramLegendData = helpers.prepareDiagramLegendData(minValue, maxValue, navigatorRange, color, ownProps.mapComponentId)

				}
			}
		}
	}

	return {
		type: legendType,
		choroplethLegendData,
		diagramLegendData
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		//TODO - load all we need
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
