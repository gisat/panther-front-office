import * as turf from '@turf/turf'
import CommonAction from '../../../state/Action';
import Select from '../state/Select';
import utils from '../../../utils/utils';

import lpisChangeCases from './LpisChangeCases/actions';
import lpisChangeCasesEdited from './LpisChangeCasesEdited/actions';
import lpisChangeDates from './LpisChangeDates/actions';

const szifLpisZmenovaRizeni = {};


const getViewState = (state) => {
	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	const activeCaseKey = activeCase.key;
	const maps = Select.maps.getSubstate(state);
	const szifZmenovaRizeni_BorderOverlays = Select.components.getDataByComponentKey(state, 'szifZmenovaRizeni_BorderOverlays');
	const szifZmenovaRizeni_ActiveLayers = Select.components.getDataByComponentKey(state, 'szifZmenovaRizeni_ActiveLayers');
	return {
		maps: {
			sets: maps.sets,
			activeSetKey: maps.activeSetKey,
		}, //remove borders layers from maps?
		components: {
			szifZmenovaRizeni_BorderOverlays,
			szifZmenovaRizeni_ActiveLayers,
		},
		specific: {
			lpisChangeDates: {
				dates: {
					[activeCaseKey]: Select.specific.lpisChangeDates.getDatesForActiveCase(state)
				}
			}
		}
	}
}

const applyView = (viewKey) => async (dispatch, getState) => {
	//apply default view
	if (!viewKey) {
		viewKey = Select.views.getActiveKey(getState());
		dispatch(CommonAction.views.apply(viewKey, {
			...CommonAction,
			specific: {
				lpisChangeCases,
				lpisChangeCasesEdited,
				lpisChangeDates,
				szifLpisZmenovaRizeni
			}
		})).then(() => {
			dispatch(szifLpisZmenovaRizeni.setInitMapOnBorderOverlays());	
			dispatch(szifLpisZmenovaRizeni.setInitMapActiveLayers());	
			dispatch(szifLpisZmenovaRizeni.setInitMapBorderView());	
			//dispatch view applied?
		});
	} else {
		//get view
		await dispatch(CommonAction.views.useKeys([viewKey]));
		dispatch(CommonAction.views.apply(viewKey, {
			...CommonAction,
			specific: {
				lpisChangeCases,
				lpisChangeCasesEdited,
				lpisChangeDates,
				szifLpisZmenovaRizeni
			}
		})).then(() => {
			//check if all components applyed
			const szifZmenovaRizeni_ActiveLayers = Select.components.getDataByComponentKey(getState(), 'szifZmenovaRizeni_ActiveLayers');
			if(!szifZmenovaRizeni_ActiveLayers) {
				dispatch(szifLpisZmenovaRizeni.setInitMapActiveLayers());	
			}

			const szifZmenovaRizeni_BorderOverlays = Select.components.getDataByComponentKey(getState(), 'szifZmenovaRizeni_BorderOverlays');
			if(!szifZmenovaRizeni_BorderOverlays) {
				dispatch(szifLpisZmenovaRizeni.setInitMapOnBorderOverlays());	
			}

			//dispatch view applied?
		});
	}
};

const setInitMapBorderView = () => (dispatch, getState) => {
	const state = getState();
	const mapSetKey = Select.maps.getActiveSetKey(state);
	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	const geometries = []
	if(activeCase.data.geometryBefore) {
		geometries.push(JSON.parse(activeCase.data.geometryBefore));
	};
	if(activeCase.data.geometryAfter) {
		geometries.push(JSON.parse(activeCase.data.geometryAfter));
	};
	const merged = geometries.length > 1 ? turf.union(...geometries) : geometries[0];
	const bboxMerged = turf.bbox(merged);
	const bboxMergedPolygon = turf.bboxPolygon(bboxMerged);
	const bbox = turf.buffer(bboxMergedPolygon, 100, {units: 'meters'});
	const bufferBbox = turf.bbox(bbox);
	const center = turf.centerOfMass(bbox);
	const horizontalLine = turf.lineString([[bufferBbox[0], bufferBbox[1]], [bufferBbox[0], bufferBbox[3]]]);
	const horizontalLength = turf.length(horizontalLine);
	const verticalLine = turf.lineString([[bufferBbox[0], bufferBbox[1]], [bufferBbox[2], bufferBbox[1]]]);
	const verticalLength = turf.length(verticalLine);
	const range = Math.max(verticalLength, horizontalLength);
	dispatch(CommonAction.maps.updateSetView(mapSetKey, {center: {lon: center.geometry.coordinates[0], lat: center.geometry.coordinates[1]}, boxRange: range * 1000}))
};

//sync maps state with borders overlays component state
const setInitMapOnBorderOverlaysToMapKey = (mapKey) => (dispatch, getState) => {
	const mapsBorderOverlays = {
		before: false,
		after: false,
	}
	dispatch(CommonAction.components.set('szifZmenovaRizeni_BorderOverlays', mapKey, mapsBorderOverlays));
};

const setInitMapOnBorderOverlays = () => (dispatch, getState) => {
	const state = getState();
	const maps = Select.maps.getMapsAsObject(state);
	for (const [key, value] of Object.entries(maps)) {
		dispatch(setInitMapOnBorderOverlaysToMapKey(key));
	}
};

//sync maps state with borders overlays component state
const setInitMapActiveLayersToMapKey = (mapKey) => (dispatch, getState) => {
	const activeLayers = []
	dispatch(CommonAction.components.set('szifZmenovaRizeni_ActiveLayers', mapKey, activeLayers));
};

const setInitMapActiveLayers = () => (dispatch, getState) => {
	const state = getState();
	const maps = Select.maps.getMapsAsObject(state);
	for (const [key, value] of Object.entries(maps)) {
		dispatch(setInitMapActiveLayersToMapKey(key));
	}
};

const getVectorSpatialDataSource = (spatialDataSourceKey, geometry, name) => {
	return {
		key: spatialDataSourceKey,
		data: {
			"nameInternal": name,
			"attribution": null,
			"type": "vector",
			"tableName": null,
			"options": {},
			"features": [{
				"type": "Feature",
				"properties": {},
				"geometry": geometry
			}]
		}
	}
}

const getRasterSpatialDataSource = (spatialDataSourceKey, name, time) => {
	return {
		key: spatialDataSourceKey,
		data: {
			"nameInternal": name,
			"attribution": null,
			"type": "wms",
			"tableName": null,
			"url": 'http://45.56.96.184:8080/geoserver/lpis/wms',
			layers: 'lpis:s2_previews_imagemosaic_2017,lpis:s2_previews_imagemosaic_2018',
			time: time,
		}
	}
}

const getSpatialRelation = (spatialDataSourceKey, spatialRelationKey, layerTemplateKey) => {
	return {
			key: spatialRelationKey,
			data: {
				caseKey: null,
				spatialDataSourceKey: spatialDataSourceKey,
				layerTemplateKey: layerTemplateKey,
				periodKey: null,
				placeKey: null,
				scenarioKey: null,
				scopeKey: null
			}
	}
}

const getLayerConfig = (layer, dispatch) => {
	const spatialDataSource = getRasterSpatialDataSource(layer.key,  'sentinel', layer.time);
	dispatch(CommonAction.spatialDataSources.add(spatialDataSource));
	
	const spatialRelation = getSpatialRelation(layer.key, `rel-${layer.key}`, `lt-${layer.key}`);
	dispatch(CommonAction.spatialRelations.add(spatialRelation));

	return {
			key: `${layer.key}`,
			layerTemplateKey: `lt-${layer.key}`,
			name: 'sentinel',
			options: {},
			filterByActive: {
				layerTemplate: `lt-${layer.key}`
			}
	}
}

const saveView = () => async (dispatch, getState) => {
	const state = getState();
	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	const activeCaseKey = activeCase.key;
	//if case has no viewKey linked yet, create and link new view
	if(!activeCase.data.viewKey) {
		const newViewKey = utils.uuid();
		//create view
		await dispatch(CommonAction.views.create(newViewKey ,'szifLpisZmenovaRizeni'));
		//link new view to case
		dispatch(lpisChangeCases.updateEdited(activeCaseKey, 'viewKey', newViewKey));
		await dispatch(lpisChangeCases.saveEdited(activeCaseKey));
	}
	const updateActiveCase = Select.specific.lpisChangeCases.getActive(getState());
	const viewState = getViewState(getState());
	//update view
	dispatch(CommonAction.views.updateEdited(updateActiveCase.data.viewKey, 'state', viewState));
	//save view
	await dispatch(CommonAction.views.saveEdited(updateActiveCase.data.viewKey));
}

const toggleLayer = (mapKey, layer) => (dispatch, getState) => {
	const activeLayers = Select.components.get(getState(), 'szifZmenovaRizeni_ActiveLayers', mapKey);

	const layerActive = activeLayers.some((l) => l.key === layer.key);
	let updatedLayers = [];
	if(layerActive) {
		updatedLayers = [...activeLayers.filter(l => l.key !== layer.key)];
	} else {
		//remove all sentinel layers before add new one
		const sentinelLayer = {
			key: layer.key,
			layerTemplateKey: layer.layerTemplateKey,
			time: layer.start.format("YYYY-MM-DD"), 
			options: layer.options,
		}
		updatedLayers = [...activeLayers.filter(l => l.options.type !== 'sentinel'), sentinelLayer];
	}

	dispatch(CommonAction.components.set('szifZmenovaRizeni_ActiveLayers', mapKey, updatedLayers));
};

const addMap = () => (dispatch, getState) => {
	const state = getState();
	const mapSetKey = Select.maps.getActiveSetKey(state);
	const mapKeys = Select.maps.getMapSetMapKeys(state, mapSetKey);
	mapKeys.sort();
	const lastMapKey = mapKeys[mapKeys.length - 1];
	const lastMapNumber = Number.parseInt(lastMapKey.match(/[\d+]/g).join(''));
	const mapKey = `szifLpisZmenovaRizeni-map-${lastMapNumber + 1}`;
	dispatch(szifLpisZmenovaRizeni.setInitMapOnBorderOverlaysToMapKey(mapKey));
	dispatch(szifLpisZmenovaRizeni.setInitMapActiveLayersToMapKey(mapKey));
	dispatch(CommonAction.maps.addMapToSet(mapSetKey, mapKey));
}

szifLpisZmenovaRizeni['applyView'] = applyView;
szifLpisZmenovaRizeni['setInitMapBorderView'] = setInitMapBorderView;
szifLpisZmenovaRizeni['setInitMapOnBorderOverlaysToMapKey'] = setInitMapOnBorderOverlaysToMapKey;
szifLpisZmenovaRizeni['setInitMapOnBorderOverlays'] = setInitMapOnBorderOverlays;
szifLpisZmenovaRizeni['setInitMapActiveLayersToMapKey'] = setInitMapActiveLayersToMapKey;
szifLpisZmenovaRizeni['setInitMapActiveLayers'] = setInitMapActiveLayers;
szifLpisZmenovaRizeni['saveView'] = saveView;
szifLpisZmenovaRizeni['toggleLayer'] = toggleLayer;
szifLpisZmenovaRizeni['addMap'] = addMap;

export default {
	...CommonAction,
	specific: {
		lpisChangeCases,
		lpisChangeCasesEdited,
		lpisChangeDates,
		szifLpisZmenovaRizeni
	}
}