import _ from 'lodash';
import ActionTypes from '../../constants/ActionTypes';
import Select from '../../state/Select';
import commonActions from '../_common/actions';
import commonHelpers from '../_common/helpers';
import commonSelectors from '../_common/selectors';
import {utils} from '@gisatcz/ptr-utils'
import {map as mapUtils, layerTree} from '@gisatcz/ptr-utils';
import Action from "../Action";

const {actionGeneralError} = commonActions;

const setInitial = commonActions.setInitial(ActionTypes.MAPS);

/*
Table of contents
	- creators
	- deprecated creators
	- actions
	- deprecated actions
	- exports
*/


/* ==================================================
 * CREATORS
 * ================================================== */

const setActiveMapKey = (mapKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(mapByKey) {
			const activeMapKey = Select.maps.getActiveMapKey(state);
			if(mapKey !== activeMapKey) {
				dispatch(actionSetActiveMapKey(mapKey));
				const setByMapKey = Select.maps.getMapSetByMapKey(state, mapKey);
				if(setByMapKey) {
					dispatch(setActiveSetKey(setByMapKey.key));
				}
			}
		} else {
			return dispatch(actionGeneralError(`Can not set mapKey ${mapKey} as active, because map with this key dont exists.`));
		}
	};
};

const setMapSetActiveMapKey = (mapKey) => {
	return (dispatch, getState) => {
		let set = Select.maps.getMapSetByMapKey(getState(), mapKey);
		if (set) {
			dispatch(actionSetMapSetActiveMapKey(set.key, mapKey));
		}
	};
};

const setActiveSetKey = (setKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(setByKey) {
			const activeSetKey = Select.maps.getActiveSetKey(state);
			if(setKey !== activeSetKey) {
				return dispatch(actionSetActiveSetKey(setKey));
			}
		} else {
			return dispatch(actionGeneralError(`Can not set setKey ${setKey} as active, because set with this key dont exists.`));
		}
	};
};

const addSet = (set) => {
	return (dispatch, getState) => {
		const state = getState();
		const setKey = set.key;
		if(!setKey) {
			return dispatch(actionGeneralError(`Undefined setKey for set ${set}`));
		} else {
			const setByKey = Select.maps.getMapSetByKey(state, setKey);
			if(setByKey) {
				return dispatch(actionGeneralError(`Set with given setKey (${setKey}) already exists ${setByKey}`));
			} else {
				dispatch(actionAddSet(set));
				//if no set is active, set set as active
				const activeSetKey = Select.maps.getActiveSetKey(state);
				if(!activeSetKey) {
					dispatch(actionSetActiveSetKey(setKey));
				}
			}
		}

	};
};

/**
 * {Object} layerTreesFilter
 * {Array} mapKeys
 */
const addLayersToMaps = (layerTreesFilter, mapKeys, useActiveMetadataKeys) => {
	return (dispatch, getState) => {
		const state = getState();
		// getIndexed
		const layerTreesData = Select.layersTrees.getByFilterOrder(state, layerTreesFilter, null);
		
		if(layerTreesData) {
			//BE should return only one record, but could be bore fore scopeKey and applicationKey. 
			//Take last record
			const lastLTdata = layerTreesData[layerTreesData.length - 1];
			
			//parse to map state
			if(lastLTdata && lastLTdata.data && lastLTdata.data.structure && lastLTdata.data.structure.length > 0) {
				const layerTreeStructure = lastLTdata.data.structure;
				dispatch(addTreeLayers(layerTreeStructure, 'layers', mapKeys, useActiveMetadataKeys));
				dispatch(addTreeLayers(layerTreeStructure, 'backgroundLayers', mapKeys, useActiveMetadataKeys));
			}
		}
	}
};

const addTreeLayers = (treeLayers, layerTreeBranchKey, mapKeys, useActiveMetadataKeys) => {
	return (dispatch, getState) => {
		const state = getState();

		//no array but object
		const flattenLT = layerTree.getFlattenLayers(treeLayers[0][layerTreeBranchKey]);
		const visibleLayers = flattenLT.filter((l) => l.visible);
		//add all visible layers in layerTree to map
		const visibleLayersKeys = visibleLayers.map(l => l.key);


		if(mapKeys) {
			mapKeys.forEach((mapKey) => {

				// check if layer in map
				const layersState = Select.maps.getLayersStateByMapKey_deprecated(state, mapKey, useActiveMetadataKeys);

				// clean templateKeys found in map
				const uniqVisibleLayersKeys = layersState ? visibleLayersKeys.filter((lk) => !layersState.some(ls => ls.layer && ls.layer.layerTemplate === lk)) : visibleLayersKeys;
				uniqVisibleLayersKeys.forEach((layerKey) => {
					const zIndex = layerTree.getLayerZindex(treeLayers[0], layerKey);
					const layer = {layerTemplate: layerKey};

					switch (layerTreeBranchKey) {
						case 'backgroundLayers':
							return dispatch(setMapBackgroundLayer(mapKey, layer, zIndex));
						case 'layers':
							return dispatch(addLayer(mapKey, layer, zIndex, useActiveMetadataKeys));
						default:
							return dispatch(addLayer(mapKey, layer, zIndex, useActiveMetadataKeys));
					}
				}) 
			})
		}
	}
};

const removeSet = (setKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(!setByKey) {
			return dispatch(actionGeneralError(`No set found for setKey ${setKey}.`));
		} else {
			return dispatch(actionRemoveSet(setKey));
		}
	};
};

const addMapToSet = (setKey, mapKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(!setByKey) {
			return dispatch(actionGeneralError(`No set found for setKey ${setKey}.`));
		} else {
			//check map exist
			if (setByKey.maps && setByKey.maps.includes(mapKey)) {
				return dispatch(actionGeneralError(`Set ${setKey} alredy contains map ${mapKey}.`));
			} else {
				dispatch(actionAddMapToSet(setKey, mapKey));
				//if no map is active, set map as active
				const activeMapKey = Select.maps.getMapSetActiveMapKey(state, setKey);
				if(!activeMapKey) {
					dispatch(setMapSetActiveMapKey(mapKey));
				}
				
			}
		}
	};
};

const removeMapKeyFromSet = (setKey, mapKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(!setByKey) {
			return dispatch(actionGeneralError(`No set found for setKey ${setKey}.`));
		} else {
			//check map exist
			if (setByKey.maps && setByKey.maps.includes(mapKey)) {
				return dispatch(actionRemoveMapKeyFromSet(setKey, mapKey));
			} else {
				return dispatch(actionGeneralError(`Set ${setKey} do not contains map ${mapKey}.`));
			}
		}
	}
};

const setSetView = (setKey, view) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(!setByKey) {
			return dispatch(actionGeneralError(`No set found for setKey ${setKey}.`));
		} else {
			return dispatch(actionSetSetView(setKey, view));
		}
	}
};

const setSetSync = (setKey, sync) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(!setByKey) {
			return dispatch(actionGeneralError(`No set found for setKey ${setKey}.`));
		} else {
			return dispatch(actionSetSetSync(setKey, sync));
		}
	}
};

const orderSetByMapPeriod = (setKey) => {
	return (dispatch, getState) => {
		const state = getState();
		let setMaps = Select.maps.getMapSetMapKeys(state, setKey);
		let maps = Select.maps.getMapsAsObject(state);
		let periods = Select.periods.getAllAsObject(state);
		if (setMaps && maps && periods) {
			let extendedSetMaps = setMaps.map(mapKey => {
				let map = _.cloneDeep(maps[mapKey]);
				let periodKey = map && map.data && map.data.metadataModifiers && map.data.metadataModifiers.period;
				if (periodKey && periods[periodKey]) {
					map.data.metadataModifiers.period = periods[periodKey].data.period || periods[periodKey].data.nameDisplay;
				}
				return map;
			});

			if (extendedSetMaps && extendedSetMaps.length) {
				let orderedExtendedSetMaps = _.orderBy(extendedSetMaps, ['data.metadataModifiers.period'], ['asc']);
				let orderedMapKeys = orderedExtendedSetMaps.map(map => map.key);
				dispatch(actionSetSetMaps(setKey, orderedMapKeys))
			}
		}
	};
};

const addMap = (map) => {
	return (dispatch, getState) => {
		if(map && !map.key) {
			return dispatch(actionGeneralError(`Undefined mapKey for map ${map}`));
		} else {
			const state = getState();
			const mapByKey = Select.maps.getMapByKey(state, map.key);
			
			if (mapByKey) {
				return dispatch(actionGeneralError(`Map with given mapKey (${map.key}) already exists ${mapByKey}`));
			} else {
				return dispatch(actionAddMap(map));
			}
		}
	};
};

const addMapForPeriod = (periodKey, setKey) => {
	return (dispatch, getState) => {
		const state = getState();
		let map = Select.maps.getMapByMetadata_deprecated(state, {period: periodKey});

		if (!map) {
			let mapKey = utils.uuid();
			map = {
				key: mapKey,
				data: {
					metadataModifiers: {
						period: periodKey
					}
				}
			};
			dispatch(addMap(map));
		}

		dispatch(addMapToSet(setKey, map.key));
		dispatch(orderSetByMapPeriod(setKey));
	};
};

const removeMap = (mapKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return dispatch(actionRemoveMap(mapKey));
		}
	};
};

const removeMapForPeriod = (periodKey, setKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const map = Select.maps.getMapByMetadata_deprecated(state, {period: periodKey});
		if(!map) {
			dispatch(actionGeneralError(`No map found for period ${periodKey}.`));
		} else {
			dispatch(removeMap(map.key));
		}
	};
};

const setMapName = (mapKey, name) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return dispatch(actionSetMapName(mapKey, name));
		}
	};
};

const setMapData = (mapKey, data) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return dispatch(actionSetMapData(mapKey, data));
		}
	};
};

const setMapView = (mapKey, view) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return dispatch(actionSetMapView(mapKey, view));
		}
	};
};

const addLayer = (mapKey, layer, index, useActiveMetadataKeys) => {
	return (dispatch, getState) => {
		const state = getState();
		if (!layer.key){
			layer.key = utils.uuid();
		}
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionAddLayer(mapKey, layer, index));
			dispatch(Action.maps.deprecated_use(mapKey, useActiveMetadataKeys));
		}
	};
};

const addLayers = (mapKey, layers) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return layers.map(layer => dispatch(addLayer(mapKey, layer)))
		}
	}
};

const removeLayer = (mapKey, layerKey) => {
	return (dispatch, getState) => {
		if(!layerKey) {
			return dispatch(actionGeneralError(`Undefined layer key.`));
		} else {
			const state = getState();
			const mapByKey = Select.maps.getMapByKey(state, mapKey);
			if(!mapByKey) {
				return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
			} else {
				//check if layer exist
				const layer = Select.maps.getMapLayerByMapKeyAndLayerKey(state, mapKey, layerKey);
				if(layer) {
					return dispatch(actionRemoveLayer(mapKey, layerKey));
				} else {
					return dispatch(actionGeneralError(`No layer (${layerKey}) found in mapKey ${mapKey}.`));
				}
			}
		}
	};
};

const removeLayers = (mapKey, layersKeys) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return layersKeys.map(layerKey => dispatch(removeLayer(mapKey, layerKey)))
		}
	}
};

const setLayerIndex = (mapKey, layerKey, index) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetLayerIndex(mapKey, layerKey, index));
		}
	}
};

const setLayerHoveredFeatureKeys = (mapKey, layerKey, hoveredFeatureKeys) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapLayer = Select.maps.getMapLayerByMapKeyAndLayerKey(state, mapKey, layerKey);
		if (mapLayer) {
			const prevKeys = mapLayer && mapLayer.options && mapLayer.options.hovered && mapLayer.options.hovered.keys;

			if (prevKeys) {
				const prevKeysString = JSON.stringify(_.sortBy(prevKeys));
				const nextKeysString = JSON.stringify(_.sortBy(hoveredFeatureKeys));
				if (prevKeysString !== nextKeysString) {
					dispatch(actionSetMapLayerHoveredFeatureKeys(mapKey, layerKey, hoveredFeatureKeys));
				}
			} else {
				dispatch(actionSetMapLayerHoveredFeatureKeys(mapKey, layerKey, hoveredFeatureKeys));
			}
		}

		// TODO
		else {
			let set = Select.maps.getMapSetByMapKey(state, mapKey);
			if (set) {
				// let setLayer = Select.maps.getSetLayerBySetKeyAndLayerKey(state, set.key, layerKey);
				// if (setLayer) {
				// 	 dispatch(actionSetSetLayerHoveredFeatureKeys(state, setKey, layerKey, hoveredFeatureKeys));
				// }
			}
		}
	}
};


const setLayerSelectedFeatureKeys = (mapKey, layerKey, selectedFeatureKeys) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapLayer = Select.maps.getMapLayerByMapKeyAndLayerKey(state, mapKey, layerKey);
		const activeSelectionKey = Select.selections.getActiveKey(state);
		const selectionKey = activeSelectionKey || utils.uuid();

		// set selection in selections store
		if (!activeSelectionKey) {
			const defaultSelection = {
				key: selectionKey,
				data: {
					colour: "#00ffff",
					//style: styleKey // TODO???
					featureKeysFilter: {
						keys: selectedFeatureKeys
					}
				}
			};
			dispatch(Action.selections.add([defaultSelection]));
			dispatch(Action.selections.setActiveKey(selectionKey));
		} else {
			dispatch(Action.selections.setActiveSelectionFeatureKeysFilterKeys(selectedFeatureKeys));
		}

		// set selection in map store
		if (mapLayer) {
			dispatch(actionClearSelectionInAllLayers(mapKey, selectionKey));
			dispatch(actionSetMapLayerSelection(mapKey, layerKey, selectionKey));
		}

		// TODO
		else {
			let set = Select.maps.getMapSetByMapKey(state, mapKey);
			if (set) {

			}
		}
	}
};

/**
 * 
 * Similar like add layer.
 * It enables to set any layer property except layerKey. 
 * Layer object is merged with default layer option.
 */
const setMapLayer = (mapKey, layerKey, layer) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			//check if layer exist
			const layerExists = Select.maps.getMapLayerByMapKeyAndLayerKey(state, mapKey, layerKey);
			if(layerExists) {
				dispatch(actionSetMapLayer(mapKey, layerKey, layer));
			} else {
				return dispatch(actionGeneralError(`No layer (${layerKey}) found in mapKey ${mapKey}.`));
			}
		}
	}
};


/**
 * 
 * It enables to update any layer property except layerKey. 
 * Layer object is merged with actual layer option.
 */
const updateMapLayer = (mapKey, layerKey, layer) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			//check if layer exist
			const layerExists = Select.maps.getMapLayerByMapKeyAndLayerKey(state, mapKey, layerKey);
			if(layerExists) {
				dispatch(actionUpdateMapLayer(mapKey, layerKey, layer));
			} else {
				return dispatch(actionGeneralError(`No layer (${layerKey}) found in mapKey ${mapKey}.`));
			}
		}
	}
};

const updateMapAndSetView = (mapKey, update) => {
	return (dispatch, getState) => {
		let set = Select.maps.getMapSetByMapKey(getState(), mapKey);
		let forSet = null;
		let forMap = null;

		if (set && set.sync) {
			// pick key-value pairs that are synced for set
			forSet = _.pickBy(update, (updateVal, updateKey) => {
				return set.sync[updateKey];
			});

			forMap = _.omitBy(update, (updateVal, updateKey) => {
				return set.sync[updateKey];
			});
		} else {
			forMap = update;
		}

		if (forSet) {
			//check data integrity
			forSet = mapUtils.ensureViewIntegrity(forSet); //TODO test
			dispatch(actionUpdateSetView(set.key, forSet));
		}

		if (forMap) {
			//check data integrity
			forMap = mapUtils.ensureViewIntegrity(forMap); //TODO test
			dispatch(actionUpdateMapView(mapKey, forMap));
		}
	}
};

const updateSetView = (setKey, update) => {
	return (dispatch, getState) => {
		let activeMapKey = Select.maps.getMapSetActiveMapKey(getState(), setKey);
		dispatch(updateMapAndSetView(activeMapKey, update));
	};
};

const resetViewHeading = (mapKey) => {
	return (dispatch, getState) => {
		const view = Select.maps.getView(getState(), mapKey);
		mapUtils.resetHeading(view.heading, heading => dispatch(updateMapAndSetView(mapKey, {heading})));
	}
};

const setMapScope = (mapKey, scope) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapScope(mapKey, scope));
		}
	};
};

const setMapScenario = (mapKey, scenario) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapScenario(mapKey, scenario));
		}
	};
};

const setMapPeriod = (mapKey, period) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapPeriod(mapKey, period));
		}
	};
};

const setMapPlace = (mapKey, place) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapPlace(mapKey, place));
		}
	};
};

const setMapCase = (mapKey, caseKey) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapCase(mapKey, caseKey));
		}
	};
};

const setMapBackgroundLayer = (mapKey, backgroundLayer) => {
	return (dispatch, getState) => {
		const state = getState();
		if (backgroundLayer && !backgroundLayer.key){
			backgroundLayer.key = utils.uuid();
		}
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapBackgroundLayer(mapKey, backgroundLayer));
			dispatch(Action.maps.deprecated_use(mapKey));
		}
	};
};
/**
 * Set (replace) all map layers, and refresh use
 * @param mapKey
 * @param layers - complete layers array
 * @returns {Function}
 */
const setMapLayers = (mapKey, layers) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			dispatch(actionSetMapLayers(mapKey, layers));
			dispatch(Action.maps.use(mapKey));
		}
	};
};

const setSetBackgroundLayer = (setKey, backgroundLayer) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(!setByKey) {
			return dispatch(actionGeneralError(`No map set found for setKey ${setKey}.`));
		} else {
			dispatch(actionSetSetBackgroundLayer(setKey, backgroundLayer));
		}
	};
};

function use(mapKey, backgroundLayer, layers) {
	return (dispatch, getState) => {
		dispatch(useClear(mapKey));
		let state = getState();

		// let filterByActive = Select.maps.getFilterByActiveByMapKey(state, mapKey);
		if (backgroundLayer || layers) {
			if (backgroundLayer) {
				backgroundLayer = {...backgroundLayer, key: 'pantherBackgroundLayer'};
				layers = layers || [];
				layers = [backgroundLayer, ...layers];
			}
		} else {
			layers = Select.maps.getAllLayersStateByMapKey(state, mapKey);
		}

		let activeKeys = commonSelectors.getAllActiveKeys(state);

		if (layers) {
			const componentId = `map_${mapKey}`;
			layers.forEach(layer => {
				let filter = {...layer.metadataModifiers};
				if (layer.layerTemplateKey) {
					filter.layerTemplateKey = layer.layerTemplateKey;
					dispatch(Action.layerTemplates.useKeys([layer.layerTemplateKey], componentId));
				} else if (layer.areaTreeLevelKey) {
					filter.areaTreeLevelKey = layer.areaTreeLevelKey;
					dispatch(Action.areas.areaTreeLevels.useKeys([layer.areaTreeLevelKey], componentId));
				}

				let filterByActive = layer.filterByActive || null;
				let mergedFilter = commonHelpers.mergeFilters(activeKeys, filterByActive, filter);


				/* Ensure spatial relations or area relations */
				if (layer.layerTemplateKey || layer.areaTreeLevelKey || mergedFilter.layerTemplateKey) {
					let action, select;
					if (layer.layerTemplateKey || mergedFilter.layerTemplateKey) {
						action = Action.spatialRelations;
						select = Select.spatialRelations;
					} else if (layer.areaTreeLevelKey) {
						action = Action.areaRelations;
						select = Select.areaRelations;
					}
					dispatch(action.useIndexedRegister(componentId, filterByActive, filter, null, 1, 1000));
					dispatch(action.ensureIndexed(mergedFilter, null, 1, 1000)).then(() => {
						/* Ensure spatial data sources */
						const relations = select.getFilteredData(getState(), mergedFilter);
						if (relations && relations.length) {
							const spatialFilters = relations.map(relation => {
								return {
									spatialDataSourceKey: relation.spatialDataSourceKey,
									fidColumnName: relation.fidColumnName
								}
							});
							const spatialDataSourcesKeys = _.uniq(spatialFilters.map(filter => filter.spatialDataSourceKey));
							
							dispatch(Action.spatialDataSources.useKeys(spatialDataSourcesKeys, componentId)).then(() => {
								const dataSources = Select.spatialDataSources.getByKeys(getState(), spatialDataSourcesKeys);
								if (dataSources) {
									dataSources.forEach(dataSource => {
										
										// TODO load raster data?
										if (dataSource && dataSource.data && dataSource.data.type === 'vector') {
											const spatialFilter = _.find(spatialFilters, {spatialDataSourceKey: dataSource.key});
											dispatch(Action.spatialData.useIndexed(null, spatialFilter, null, 1, 1, componentId));
										}
									});
								}
							});
						}
					});
				}
				
				
				// Ensure attribute data //todo
				// TODO layer.attributeKey case?
				// TODO handle "key: in {}" case in filters
				if (layer.attributeKeys) {
					dispatch(Action.attributes.useKeys(layer.attributeKeys, componentId));

					let attributeFilter = {
						...layer.attributeMetadataModifiers,
						attributeKey: {
							in: layer.attributeKeys
						}
					};

					if (layer.layerTemplateKey) {
						attributeFilter.layerTemplateKey = layer.layerTemplateKey;
					} else if (layer.areaTreeLevelKey) {
						attributeFilter.areaTreeLevelKey = layer.areaTreeLevelKey;
					}

					let attributeFilterByActive = layer.attributeFilterByActive || null;
					let mergedAttributeFilter = commonHelpers.mergeFilters(activeKeys, attributeFilterByActive, attributeFilter);

					dispatch(Action.attributeRelations.useIndexedRegister( componentId, attributeFilterByActive, attributeFilter, null, 1, 2000));
					dispatch(Action.attributeRelations.ensureIndexed(mergedAttributeFilter, null, 1, 2000)).then(() => {
						/* Ensure data sources */
						const relations = Select.attributeRelations.getIndexed(getState(), attributeFilterByActive, attributeFilter, null, 1, 2000);
						if (relations && relations.length) {
							const filters = relations.map(relation => {return {
								attributeDataSourceKey: relation.data && relation.data.attributeDataSourceKey,
								fidColumnName: relation.data && relation.data.fidColumnName
							}});
							const dataSourcesKeys = filters.map(filter => filter.attributeDataSourceKey);

							dispatch(Action.attributeDataSources.useKeys(dataSourcesKeys, componentId)).then(() => {
								const dataSources = Select.attributeDataSources.getByKeys(getState(), dataSourcesKeys);
								if (dataSources) {

									let dataSourceKeys = [];
									dataSources.forEach(dataSource => {
										dataSourceKeys.push(dataSource.key);
									});

									// TODO fidColumnName!!!
									const filter = {
										attributeDataSourceKey: {
											in: dataSourceKeys
										},
										fidColumnName: relations[0].data.fidColumnName
									};
									dispatch(Action.attributeData.useIndexed(null, filter, null, 1, 1, componentId));

								}
							});
						}
					});

				}

				if (layer.styleKey) {
					dispatch(Action.styles.useKeys([layer.styleKey],componentId));
				}
			});
		}
	}
}

function useClear(mapKey) {
	return (dispatch) => {
		dispatch(commonActions.useIndexedClear(ActionTypes.SPATIAL_RELATIONS)(`map_${mapKey}`));
		dispatch(commonActions.useKeysClear(ActionTypes.SPATIAL_DATA_SOURCES)(`map_${mapKey}`));
		dispatch(commonActions.useKeysClear(ActionTypes.LAYER_TEMPLATES)(`map_${mapKey}`));
		dispatch(commonActions.useKeysClear(ActionTypes.AREAS.AREA_TREE_LEVELS)(`map_${mapKey}`));
		dispatch(commonActions.useKeysClear(ActionTypes.STYLES)(`map_${mapKey}`));
	};
}

function updateStateFromView(data) {
	return dispatch => {
		if (data) {
			dispatch(actionUpdate(data));
		}
	};
}

function goToPlace(placeString) {
	return (dispatch, getState) => {
		if (placeString && placeString.length) {
			mapUtils.getLocationFromPlaceString(placeString).then(location => {
				if (location) {
					let mapKey = Select.maps.getActiveMapKey(getState());
					dispatch(updateMapAndSetView(mapKey, location));

					// TODO temporary solution for old map state
					let navigatorUpdate = {
						range: location.boxRange,
						lookAtLocation: {
							latitude: location.center.lat,
							longitude: location.center.lon
						}
					};
					dispatch(deprecated_updateWorldWindNavigator(mapKey,navigatorUpdate)); // TODO deprecated
				}
			});
		}
	};
}

/* ==================================================
 * DEPRECATED CREATORS
 * ================================================== */

const deprecated_use = (mapKey, useActiveMetadataKeys) => {
	return (dispatch, getState) => {
		let state = getState();
		let layers = Select.maps.getLayersStateByMapKey_deprecated(state, mapKey, useActiveMetadataKeys);
		let backgroundLayer = Select.maps.getBackgroundLayerStateByMapKey_deprecated(state, mapKey);
		let finalLayers = [];

		if (backgroundLayer) {
			finalLayers.push(backgroundLayer);
		}

		if (layers) {
			finalLayers = finalLayers.concat(layers);
		}

		if (finalLayers.length) {
			const componentId = `map_${mapKey}`;

			finalLayers.forEach(filters => {

				//assume, that spatial data dont need period
				const spatialRelationsFilter = _.cloneDeep(filters.mergedFilter);
				const spatialRelationsFilterByActive= _.cloneDeep(filters.filterByActive);

				if (spatialRelationsFilter.periodKey) {
					delete spatialRelationsFilter.periodKey;
				}

				if (spatialRelationsFilter.attributeKey) {
					delete spatialRelationsFilter.attributeKey;
				}

				if (spatialRelationsFilterByActive.attribute) {
					delete spatialRelationsFilterByActive.attribute;
				}


				dispatch(Action.spatialRelations.useIndexedRegister( componentId, spatialRelationsFilterByActive, spatialRelationsFilter, null, 1, 1000));
				dispatch(Action.spatialRelations.ensureIndexed(spatialRelationsFilter, null, 1, 1000))
					.then(() => {
						let spatialDataSourcesKeys = Select.spatialRelations.getDataSourceKeysFiltered(getState(), spatialRelationsFilter);
						if (spatialDataSourcesKeys && spatialDataSourcesKeys.length) {

							dispatch(Action.spatialDataSources.useKeys([spatialDataSourcesKeys[0]], componentId)).then(() => {
								let dataSource = Select.spatialDataSources.getByKeys(getState(), spatialDataSourcesKeys);
								//datasource is only one
								//if vector dataSource, then load attribute data
								if(dataSource && dataSource[0] && dataSource[0].data.type === 'vector') {
									let spatialDataSources = Select.spatialRelations.getFilteredData(getState(), spatialRelationsFilter);

									const spatialFilter = {
										spatialDataSourceKey: dataSource[0].key,
										fidColumnName: spatialDataSources[0].fidColumnName
									};

									const spatialData = Select.spatialDataSources.vector.getBatchByFilterOrder(getState(), spatialFilter, null);
									//if data already loaded, skip loading
									if(!spatialData) {
										dispatch(Action.spatialDataSources.vector.loadLayerData(spatialFilter, componentId));
									}
									const attributeFilter = _.cloneDeep(filters.mergedFilter);

									dispatch(Action.attributeRelations.useIndexedRegister( componentId, filters.filterByActive, attributeFilter, null, 1, 1000));
									dispatch(Action.attributeRelations.ensureIndexedSpecific(attributeFilter, null, 1, 1000, componentId));
								}

							});
						}
					})
					.catch((err) => {
						dispatch(commonActions.actionGeneralError(err));
					});

				// TODO register and ensure layer templates
			});
		}
	};
};

const deprecated_useClear = (mapKey) => {
	return (dispatch) => {
		dispatch(commonActions.useIndexedClear(ActionTypes.SPATIAL_RELATIONS)(`map_${mapKey}`));
	};
};

const deprecated_checkWorldWindNavigatorIntegrity = (WorldWindNavigator) => {
	if (WorldWindNavigator.heading && WorldWindNavigator.heading > 360) {
		WorldWindNavigator.heading = WorldWindNavigator.heading - 360;
	}

	if (WorldWindNavigator.heading && WorldWindNavigator.heading < -360) {
		WorldWindNavigator.heading = WorldWindNavigator.heading + 360;
	}

	if (WorldWindNavigator.tilt && WorldWindNavigator.tilt < 0) {
		WorldWindNavigator.tilt = 0;
	}

	if (WorldWindNavigator.tilt && WorldWindNavigator.tilt > 90) {
		WorldWindNavigator.tilt = 90;
	}
	return WorldWindNavigator;
};

const deprecated_setMapWorldWindNavigator = (mapKey, worldWindNavigator) => {
	return (dispatch, getState) => {
		const state = getState();
		const mapByKey = Select.maps.getMapByKey(state, mapKey);
		if(!mapByKey) {
			return dispatch(actionGeneralError(`No map found for mapKey ${mapKey}.`));
		} else {
			return dispatch(deprecated_actionSetMapWorldWindNavigator(mapKey, worldWindNavigator));
		}
	};
};

const deprecated_setSetWorldWindNavigator = (setKey, worldWindNavigator) => {
	return (dispatch, getState) => {
		const state = getState();
		const setByKey = Select.maps.getMapSetByKey(state, setKey);
		if(!setByKey) {
			return dispatch(actionGeneralError(`No set found for setKey ${setKey}.`));
		} else {
			return dispatch(deprecated_actionSetSetWorldWindNavigator(setKey, worldWindNavigator));
		}
	}
};

const deprecated_updateWorldWindNavigator = (mapKey, updates) => {
	return (dispatch, getState) => {
		let set = Select.maps.getMapSetByMapKey(getState(), mapKey);
		let forSet = {};
		let forMap = {};

		if (set && set.sync) {
			forSet = _.pickBy(updates, (updateVal, updateKey) => {
				if (updateKey === 'lookAtLocation') {
					return set.sync['location'];
				} else {
					return set.sync[updateKey];
				}
			});

			forMap = _.omitBy(updates, (updateVal, updateKey) => {
				if (updateKey === 'lookAtLocation') {
					return set.sync['location'];
				} else {
					return set.sync[updateKey];
				}
			});
		} else {
			forMap = updates;
		}

		if (forSet && !_.isEmpty(forSet)) {
			//check data integrity
			forSet = deprecated_checkWorldWindNavigatorIntegrity(forSet); //TODO test
			dispatch(deprecated_actionUpdateSetWorldWindNavigator(set.key, forSet));
		}

		if (forMap && !_.isEmpty(forMap)) {
			//check data integrity
			forMap = deprecated_checkWorldWindNavigatorIntegrity(forMap); //TODO test
			dispatch(deprecated_actionUpdateMapWorldWindNavigator(mapKey, forMap));
		}
	}
};

const deprecated_resetWorldWindNavigatorHeading = (mapKey, defaultIncrement) => {
	return (dispatch, getState) => {
		const mapNavigator = Select.maps.getNavigator_deprecated(getState(), mapKey);

		let headingIncrement = 1.0;
		if (Math.abs(mapNavigator.heading) > 60) {
			headingIncrement = 2.0;
		} else if (Math.abs(mapNavigator.heading) > 120) {
			headingIncrement = 3.0;
		}
		//set shortest direction based on angle
		if (mapNavigator.heading > 0 && mapNavigator.heading < 180 || mapNavigator.heading < 0 && mapNavigator.heading < -180) {
			headingIncrement = -headingIncrement;
		}
		headingIncrement = defaultIncrement || headingIncrement;

		setTimeout(() => {
			let finalHeading;
			if (Math.abs(mapNavigator.heading) > Math.abs(headingIncrement)) {
				finalHeading = mapNavigator.heading + headingIncrement;
				dispatch(deprecated_updateWorldWindNavigator(mapKey, {heading: finalHeading}))
				dispatch(deprecated_resetWorldWindNavigatorHeading(mapKey, headingIncrement));
			} else {
				finalHeading = 0;
				dispatch(deprecated_updateWorldWindNavigator(mapKey, {heading: finalHeading}))
			}
		}, 20)

	}
};




/* ==================================================
 * ACTIONS
 * ================================================== */

const actionSetActiveMapKey = (mapKey) => {
	return {
		type: ActionTypes.MAPS.SET_ACTIVE_MAP_KEY,
		mapKey
	}
};

const actionSetMapSetActiveMapKey = (setKey, mapKey) => {
	return {
		type: ActionTypes.MAPS.SET.SET_ACTIVE_MAP_KEY,
		mapKey,
		setKey
	}
};

const actionSetActiveSetKey = (setKey) => {
	return {
		type: ActionTypes.MAPS.SET_ACTIVE_SET_KEY,
		setKey
	}
};

const actionAddSet = (set) => {
	return {
		type: ActionTypes.MAPS.SET.ADD,
		set
	}
};

const actionRemoveSet = (setKey) => {
	return {
		type: ActionTypes.MAPS.SET.REMOVE,
		setKey
	}
};

const actionAddMapToSet = (setKey, mapKey) => {
	return {
		type: ActionTypes.MAPS.SET.ADD_MAP,
		setKey,
		mapKey,
	}
};

const actionRemoveMapKeyFromSet = (setKey, mapKey) => {
	return {
		type: ActionTypes.MAPS.SET.REMOVE_MAP,
		setKey,
		mapKey,
	}
};

const actionSetSetView = (setKey, view) => {
	return {
		type: ActionTypes.MAPS.SET.VIEW.SET,
		setKey,
		view
	}
};

const actionUpdateSetView = (setKey, update) => {
	return {
		type: ActionTypes.MAPS.SET.VIEW.UPDATE,
		setKey,
		update
	}
};

const actionSetSetSync = (setKey, sync) => {
	return {
		type: ActionTypes.MAPS.SET.SET_SYNC,
		setKey,
		sync,
	}
};

const actionSetSetMaps = (setKey, maps) => {
	return {
		type: ActionTypes.MAPS.SET.SET_MAPS,
		setKey,
		maps,
	}
};

const actionAddMap = (map) => {
	return {
		type: ActionTypes.MAPS.MAP.ADD,
		map,
	}
};

const actionRemoveMap = (mapKey) => {
	return {
		type: ActionTypes.MAPS.MAP.REMOVE,
		mapKey,
	}
};

const actionSetMapName = (mapKey, name) => {
	return {
		type: ActionTypes.MAPS.MAP.SET_NAME,
		mapKey,
		name,
	}
};

const actionSetMapData = (mapKey, data) => {
	return {
		type: ActionTypes.MAPS.MAP.SET_DATA,
		mapKey,
		data,
	}
};

const actionSetMapView = (mapKey, view) => {
	return {
		type: ActionTypes.MAPS.MAP.VIEW.SET,
		mapKey,
		view
	}
};

const actionUpdateMapView = (mapKey, update) => {
	return {
		type: ActionTypes.MAPS.MAP.VIEW.UPDATE,
		mapKey,
		update
	}
};


const actionAddLayer = (mapKey, layer, index) => {
	return {
		type: ActionTypes.MAPS.LAYERS.LAYER.ADD,
		mapKey,
		layer,
		index,
	}
};

const actionRemoveLayer = (mapKey, layerKey) => {
	return {
		type: ActionTypes.MAPS.LAYERS.LAYER.REMOVE,
		mapKey,
		layerKey,
	}
};

const actionSetLayerIndex = (mapKey, layerKey, index) => {
	return {
		type: ActionTypes.MAPS.LAYERS.LAYER.SET_INDEX,
		mapKey,
		layerKey,
		index,
	}
};

const actionUpdateMapLayer = (mapKey, layerKey, layer) => {
	return {
		type: ActionTypes.MAPS.LAYERS.LAYER.UPDATE,
		mapKey,
		layerKey,
		layer,
	}
};

const actionSetMapLayer = (mapKey, layerKey, layer) => {
	return {
		type: ActionTypes.MAPS.LAYERS.LAYER.SET,
		mapKey,
		layerKey,
		layer,
	}
};

const actionSetMapLayerHoveredFeatureKeys = (mapKey, layerKey, hoveredFeatureKeys) => {
	return {
		type: ActionTypes.MAPS.MAP.LAYERS.SET.HOVERED_FEATURE_KEYS,
		mapKey,
		layerKey,
		hoveredFeatureKeys
	}
};

const actionSetMapLayerSelection = (mapKey, layerKey, selectionKey) => {
	return {
		type: ActionTypes.MAPS.MAP.LAYERS.SET.SELECTION,
		mapKey,
		layerKey,
		selectionKey
	}
};

const actionClearSelectionInAllLayers = (mapKey, selectionKey) => {
	return {
		type: ActionTypes.MAPS.MAP.LAYERS.CLEAR.SELECTION,
		mapKey,
		selectionKey
	}
};

const actionSetMapBackgroundLayer = (mapKey, backgroundLayer) => {
	return {
		type: ActionTypes.MAPS.SET_BACKGROUND_LAYER,
		mapKey,
		backgroundLayer,
	}
};

const actionSetSetBackgroundLayer = (setKey, backgroundLayer) => {
	return {
		type: ActionTypes.MAPS.SET.SET_BACKGROUND_LAYER,
		setKey,
		backgroundLayer,
	}
};

const actionSetMapLayers = (mapKey, layers) => {
	return {
		type: ActionTypes.MAPS.LAYERS.SET,
		mapKey,
		layers,
	}
};

const actionSetMapCase = (mapKey, caseKey) => {
	return {
		type: ActionTypes.MAPS.SET_CASE,
		mapKey,
		case: caseKey,
	}
};

const actionSetMapScope = (mapKey, scope) => {
	return {
		type: ActionTypes.MAPS.SET_SCOPE,
		mapKey,
		scope,
	}
};

const actionSetMapScenario = (mapKey, scenario) => {
	return {
		type: ActionTypes.MAPS.SET_SCENARIO,
		mapKey,
		scenario,
	}
};

const actionSetMapPlace = (mapKey, place) => {
	return {
		type: ActionTypes.MAPS.SET_PLACE,
		mapKey,
		place,
	}
};

const actionSetMapPeriod = (mapKey, period) => {
	return {
		type: ActionTypes.MAPS.SET_PERIOD,
		mapKey,
		period,
	}
};

const actionUpdate = (data) => {
	return {
		type: ActionTypes.MAPS.UPDATE,
		data
	}
};

/* ==================================================
 * DEPRECATED ACTIONS
 * ================================================== */

const deprecated_actionSetSetWorldWindNavigator = (setKey, worldWindNavigator) => {
	return {
		type: ActionTypes.MAPS.SET.WORLD_WIND_NAVIGATOR.SET,
		setKey,
		worldWindNavigator,
	}
};

const deprecated_actionUpdateSetWorldWindNavigator = (setKey, worldWindNavigator) => {
	return {
		type: ActionTypes.MAPS.SET.WORLD_WIND_NAVIGATOR.UPDATE,
		setKey,
		worldWindNavigator,
	}
};

const deprecated_actionSetMapWorldWindNavigator = (mapKey, worldWindNavigator) => {
	return {
		type: ActionTypes.MAPS.MAP.WORLD_WIND_NAVIGATOR.SET,
		mapKey,
		worldWindNavigator,
	}
};

const deprecated_actionUpdateMapWorldWindNavigator = (mapKey, worldWindNavigator) => {
	return {
		type: ActionTypes.MAPS.MAP.WORLD_WIND_NAVIGATOR.UPDATE,
		mapKey,
		worldWindNavigator,
	}
};

// ============ export ===========

// TODO better naming
export default {
	addLayer,
	addLayers,
	addLayersToMaps, // TODO ???
	addMap,
	addMapForPeriod,
	addMapToSet,
	addSet,

	goToPlace,

	removeLayer,
	removeLayers,
	removeMap,
	removeMapForPeriod,
	removeMapKeyFromSet,
	removeSet,

	resetViewHeading,

	setActiveMapKey,
	setActiveSetKey,
	setLayerHoveredFeatureKeys,
	setLayerSelectedFeatureKeys,
	setLayerIndex,

	setMapBackgroundLayer,
	setMapCase,
	setMapData,
	setMapLayer,
	setMapLayers,
	setMapName,
	setMapPeriod,
	setMapPlace,
	setMapScenario,
	setMapScope,
	setMapView,

	setMapSetActiveMapKey,
	setSetBackgroundLayer,
	setSetSync,
	setSetView,

	setInitial,

	updateMapLayer,
	updateStateFromView,
	updateMapAndSetView,
	updateSetView,

	use,
	useClear,


	// Deprecated
	deprecated_resetWorldWindNavigatorHeading,
	deprecated_setMapWorldWindNavigator,
	deprecated_setSetWorldWindNavigator,
	deprecated_updateWorldWindNavigator,
	deprecated_use,
	deprecated_useClear
}
