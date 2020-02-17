import _ from 'lodash';
import createCachedSelector from "re-reselect";
import commonSelectors from '../_common/selectors';
import {CacheFifo} from "panther-utils";

let mergeFeaturesWithAttributesCache = new CacheFifo(20);

const getMergedFilterFromLayerStateAndActiveMetadataKeys = createCachedSelector(
	[
		(layer) => layer,
		(layer, activeMetadataKeys) => activeMetadataKeys,
		(layer, activeMetadataKeys, modifiersPath) => modifiersPath
	],
	(layer, activeMetadataKeys, modifiersPath) => {
		let filter = {...layer[modifiersPath]};
		if (layer.layerTemplateKey) {
			filter.layerTemplateKey = layer.layerTemplateKey;
		}
		if (layer.areaTreeLevelKey) {
			filter.areaTreeLevelKey = layer.areaTreeLevelKey;
		}

		//todo fail on conflict between metadataModifiers & filterByActive ?
		//todo special filterByActive for attribute data

		let activeFilter = {};
		if (layer.filterByActive) {
			let active = layer.filterByActive;
			if (active.attribute && activeMetadataKeys.activeAttributeKey) {
				activeFilter.attributeKey = activeMetadataKeys.activeAttributeKey;
			}
			if (active.case && activeMetadataKeys.activeCaseKey) {
				activeFilter.caseKey = activeMetadataKeys.activeCaseKey;
			}
			if (active.layerTemplate && activeMetadataKeys.activeLayerTemplateKey) {
				activeFilter.layerTemplateKey = activeMetadataKeys.activeLayerTemplateKey;
			}
			if (active.areaTreeLevelKey && activeMetadataKeys.areaTreeLevelKey) {
				activeFilter.areaTreeLevelKey = activeMetadataKeys.areaTreeLevelKey;
			}
			// TODO what if multiple periods
			if (active.period && activeMetadataKeys.activePeriodKey) {
				activeFilter.periodKey = activeMetadataKeys.activePeriodKey;
			}
			// TODO what if multiple places
			if (active.place && activeMetadataKeys.activePlaceKey) {
				activeFilter.placeKey = activeMetadataKeys.activePlaceKey;
			}
			if (active.scenario && activeMetadataKeys.activeScenarioKey) {
				activeFilter.scenarioKey = activeMetadataKeys.activeScenarioKey;
			}
			if (active.scope && activeMetadataKeys.activeScopeKey) {
				activeFilter.scopeKey = activeMetadataKeys.activeScopeKey;
			}
		}

		return {...filter, ...activeFilter}
	}
)((layer, activeMetadataKeys) => `${layer}_${activeMetadataKeys}`);

const getBackgroundLayersWithFilter = createCachedSelector(
	[
		commonSelectors.getAllActiveKeys,
		(state, layerState) => layerState,
		(state, layerState, layerKey) => layerKey
	],
	(activeMetadataKeys, layerState, layerKey) => {
		layerState = JSON.parse(layerState);

		return [{
			key: layerKey,
			filter: getMergedFilterFromLayerStateAndActiveMetadataKeys(layerState, activeMetadataKeys, 'metadataModifiers')
		}]
	}
)((state, layerState, layerKey) => (`${layerState}:${layerKey}`));




const getLayersWithFilter = createCachedSelector(
	[
		commonSelectors.getAllActiveKeys,
		(state, layersState) => layersState
	],
	(activeMetadataKeys, layersState) => {
		layersState = JSON.parse(layersState);
		if (layersState && layersState.length) {
			return _.map(layersState, (layer) => {
				return {
					key: layer.key,
					filter: getMergedFilterFromLayerStateAndActiveMetadataKeys(layer, activeMetadataKeys, 'metedataModifiers'),
					attributeFilter: getMergedFilterFromLayerStateAndActiveMetadataKeys(layer, activeMetadataKeys, 'attributeMetadataModifiers')
				}
			});
		} else {
			return null;
		}
	}
)((state, layersState) => layersState);

const prepareLayerByDataSourceType = (layerKey, dataSource, fidColumnName, index, layerState, style, attributeDataSources, selections) => {
	const layerOptions = layerState && layerState.options;
	let dataSourceData = dataSource.data;

	let {attribution, nameInternal, type, tableName, layerName, features, selected, ...options} = dataSourceData;

	// TODO data source strucutre
	if (type === 'wmts') {
		options.url = options.urls[0];
	} else if (type === 'wms') {
		let {url, ...params} = options;
		options = {
			params,
			url
		}
	} else if (type === 'vector' && features) {
		if (attributeDataSources) {
			features = mergeFeaturesWithAttributes(layerKey, features, attributeDataSources, fidColumnName);
		}

		if (selections && layerOptions.selected) {
			let populatedSelections = {};
			_.forIn(layerOptions.selected, (value, key) => {
				let selection = selections[key];

				// TODO other selection types
				if (selection && selection.data && selection.data.featureKeysFilter) {
					// TODO style?
					populatedSelections[key] = {
						style: {
							rules: [
								{
									styles: [{
										fill: selection.data.colour
									}]
								}
							]
						},
						keys: selection.data.featureKeysFilter.keys
					}
				}
			});
			selected = populatedSelections;
		}
		
		
		options = {
			...layerOptions,
			features,
			selected,
			fidColumnName
		};

		// TODO type=geoserver
		if (style && style.data && style.data.source === 'definition') {
			options.style = style.data.definition;
		}
	}

	return {
		key: layerKey + '_' + index,
		layerKey: layerKey,
		opacity: (layerState && layerState.opacity) || 1,
		type,
		options
	};
};

function mergeFeaturesWithAttributes(layerKey, features, attributeDataSources, fidColumnName) {
	let cacheKey = JSON.stringify(layerKey);
	let cache = mergeFeaturesWithAttributesCache.findByKey(cacheKey);

	let finalFeaturesObject = {};
	if (cache && cache.features === features) {
		finalFeaturesObject = cache.finalFeaturesObject;
	} else {
		features.forEach((feature) => {
			let key = feature.properties[fidColumnName];
			finalFeaturesObject[key] = {...feature};
		});

	}

	attributeDataSources.forEach(attributeDataSource => {
		let featuresWithAttributes = attributeDataSource.dataSource.data.features;
		if (featuresWithAttributes) {
			featuresWithAttributes.forEach(featureWithAttributes => {
				let featureKey = featureWithAttributes.properties[fidColumnName];

				_.forIn(featureWithAttributes.properties, (value, key) => {
					finalFeaturesObject[featureKey].properties[key] = value;
				});
			});
		}
	});

	mergeFeaturesWithAttributesCache.addOrUpdate({
		cacheKey,
		features,
		finalFeaturesObject
	});


	return Object.values(finalFeaturesObject);
}

export default {
	getBackgroundLayersWithFilter,
	getLayersWithFilter,
	prepareLayerByDataSourceType
}