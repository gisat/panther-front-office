import _ from 'lodash';
import createCachedSelector from "re-reselect";
import commonSelectors from '../_common/selectors';

const getMergedFilterFromLayerStateAndActiveMetadataKeys = createCachedSelector(
	[
		(layer) => layer,
		(layer, activeMetadataKeys) => activeMetadataKeys
	],
	(layer, activeMetadataKeys) => {
		let filter = {};
		if (layer.filterByActive) {
			let active = layer.filterByActive;
			if (active.attribute && activeMetadataKeys.activeAttributeKey) {
				filter.attributeKey = activeMetadataKeys.activeAttributeKey;
			}
			if (active.case && activeMetadataKeys.activeCaseKey) {
				filter.caseKey = activeMetadataKeys.activeCaseKey;
			}
			if (active.layerTemplate && activeMetadataKeys.activeLayerTemplateKey) {
				filter.layerTemplateKey = activeMetadataKeys.activeLayerTemplateKey;
			}
			// TODO what if multiple periods
			if (active.period && activeMetadataKeys.activePeriodKey) {
				filter.periodKey = activeMetadataKeys.activePeriodKey;
			}
			// TODO what if multiple places
			if (active.place && activeMetadataKeys.activePlaceKey) {
				filter.placeKey = activeMetadataKeys.activePlaceKey;
			}
			if (active.scenario && activeMetadataKeys.activeScenarioKey) {
				filter.scenarioKey = activeMetadataKeys.activeScenarioKey;
			}
			if (active.scope && activeMetadataKeys.activeScopeKey) {
				filter.scopeKey = activeMetadataKeys.activeScopeKey;
			}
		}

		return {...layer.metadataModifiers, ...filter}
	}
)((layer, activeMetadataKeys) => `${layer}_${activeMetadataKeys}`);

const getBackgroundLayersWithFilter = createCachedSelector(
	[
		(layerState) => layerState,
		(layerState, layerKey) => layerKey
	],
	(layerState, layerKey) => {
		return [{
			key: layerKey,
			filter: layerState
		}]
	}
)((layerState, layerKey) => (layerKey + JSON.stringify(layerState)));

const getLayersWithFilter = createCachedSelector(
	[
		commonSelectors.getAllActiveKeys,
		(state, layersState) => layersState
	],
	(activeMetadataKeys, layersState) => {
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
)((state, layersState) => JSON.stringify(layersState));

export default {
	getBackgroundLayersWithFilter,
	getLayersWithFilter
}