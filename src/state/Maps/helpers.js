import _ from 'lodash';
import createCachedSelector from "re-reselect";
import commonSelectors from '../_common/selectors';

const getMergedFilterFromLayerStateAndActiveMetadataKeys = createCachedSelector(
	[
		(layer) => layer,
		(layer, activeMetadataKeys) => activeMetadataKeys
	],
	(layer, activeMetadataKeys) => {
		let filter = {...layer.metadataModifiers};
		if (layer.layerTemplateKey) {
			filter.layerTemplateKey = layer.layerTemplateKey;
		}

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
			filter: getMergedFilterFromLayerStateAndActiveMetadataKeys(layerState, activeMetadataKeys)
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
					filter: getMergedFilterFromLayerStateAndActiveMetadataKeys(layer, activeMetadataKeys)
				}
			});
		} else {
			return null;
		}
	}
)((state, layersState) => layersState);

const prepareLayerByDataSourceType = (layerKey, dataSource, index) => {
	let dataSourceData = dataSource.data;
	let {attribution, nameInternal, type, ...options} = dataSourceData;

	// TODO data source strucutre
	if (type === 'wmts') {
		options.url = options.urls[0];
	}
	if (type === 'wms') {
		let {url, ...params} = options;
		options = {
			params,
			url
		}
	}

	return {
		key: layerKey + '_' + index,
		type,
		options
	};
};

export default {
	getBackgroundLayersWithFilter,
	getLayersWithFilter,
	prepareLayerByDataSourceType
}