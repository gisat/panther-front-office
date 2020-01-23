import * as turf from '@turf/turf'
import CommonAction from '../../../state/Action';
import Select from '../state/Select';
import utils from '../../../utils/utils';

import lpisChangeCases from './LpisChangeCases/actions';
import lpisChangeCasesEdited from './LpisChangeCasesEdited/actions';
import lpisChangeDates from './LpisChangeDates/actions';

const szifLpisZmenovaRizeni = {};


const getViewState = (state) => {
	const maps = Select.maps.getSubstate(state);
	const szifZmenovaRizeni_BorderOverlays = Select.components.getDataByComponentKey(state, 'szifZmenovaRizeni_BorderOverlays');
	const szifZmenovaRizeni_ActiveLayers = Select.components.getDataByComponentKey(state, 'szifZmenovaRizeni_ActiveLayers');
	return {
		maps: maps, //remove borders layers from maps?
		components: {
			szifZmenovaRizeni_BorderOverlays,
			szifZmenovaRizeni_ActiveLayers,
		}
	}
}

const applyView = (viewKey) => async (dispatch, getState) => {
	//apply default view
	if (!viewKey) {
		viewKey = Select.views.getActiveKey(getState());
		dispatch(CommonAction.views.apply(viewKey, CommonAction)).then(() => {
			dispatch(szifLpisZmenovaRizeni.setInitMapOnBorderOverlays());	
			dispatch(szifLpisZmenovaRizeni.setInitMapActiveLayers());	
			dispatch(szifLpisZmenovaRizeni.setInitMapBorderView());	
		});
	} else {
		//get view
		await dispatch(CommonAction.views.useKeys([viewKey]));
		dispatch(CommonAction.views.apply(viewKey, CommonAction)).then(() => {
			//check if all components applyed
			const szifZmenovaRizeni_ActiveLayers = Select.components.getDataByComponentKey(getState(), 'szifZmenovaRizeni_ActiveLayers');
			if(!szifZmenovaRizeni_ActiveLayers) {
				dispatch(szifLpisZmenovaRizeni.setInitMapActiveLayers());	
			}

			const szifZmenovaRizeni_BorderOverlays = Select.components.getDataByComponentKey(getState(), 'szifZmenovaRizeni_BorderOverlays');
			if(!szifZmenovaRizeni_BorderOverlays) {
				dispatch(szifLpisZmenovaRizeni.setInitMapOnBorderOverlays());	
			}

			//for each map
			const maps = Select.maps.getMapsAsObject(getState());
			for (const [key, value] of Object.entries(maps)) {
				dispatch(szifLpisZmenovaRizeni.updateMap(key));
			}
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
}

//sync maps state with borders overlays component state
const setInitMapOnBorderOverlays = () => (dispatch, getState) => {
	const state = getState();
	const maps = Select.maps.getMapsAsObject(state);
	for (const [key, value] of Object.entries(maps)) {
		const mapsBorderOverlays = {
			before: false,
			after: false,
		}
		dispatch(CommonAction.components.set('szifZmenovaRizeni_BorderOverlays', key, mapsBorderOverlays));
	}
};

//sync maps state with borders overlays component state
const setInitMapActiveLayers = () => (dispatch, getState) => {
	const state = getState();
	const maps = Select.maps.getMapsAsObject(state);
	for (const [key, value] of Object.entries(maps)) {
		const activeLayers = []
		dispatch(CommonAction.components.set('szifZmenovaRizeni_ActiveLayers', key, activeLayers));
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
	const spatialDataSource = getRasterSpatialDataSource(layer.key,  'sentinel', layer.start.format("YYYY-MM-DD"));
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
		updatedLayers = [...activeLayers.filter(l => l.options.type !== 'sentinel'), layer];
	}

	dispatch(CommonAction.components.set('szifZmenovaRizeni_ActiveLayers', mapKey, updatedLayers));
	dispatch(szifLpisZmenovaRizeni.updateMap(mapKey));
};

const updateMap = (activeMapKey) => (dispatch, getState) => {

	////// Sync overlays to map part

	const state = getState();
	const activeMapBorderState = Select.components.get(state, 'szifZmenovaRizeni_BorderOverlays', activeMapKey);

	const spatialDataSourceKey = '7f829c40-cf7f-4099-ac93-a5c9a430f836';
	const beforeLayerTemplateKey = 'd390e2ca-92e7-4bbf-bba3-87b74b64fcf2';
	const afterLayerTemplateKey = 'dfaa2fe9-3ea1-4a8a-a8e0-17023c5e3e1c';
	const spatialRelationKey = '5a4ae8a4-ae08-4ee2-bea6-3fe746e1b62d';

	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	const geometryBefore = activeCase.data.geometryBefore;
	const geometryAfter = activeCase.data.geometryAfter;

	const layers = [];

	if(activeMapBorderState.before) {
		const spatialDataSource = getVectorSpatialDataSource(spatialDataSourceKey, JSON.parse(geometryBefore), 'geometryBefore');
		dispatch(CommonAction.spatialDataSources.add(spatialDataSource));
		
		const spatialRelation = getSpatialRelation(spatialDataSourceKey, spatialRelationKey, beforeLayerTemplateKey);
		dispatch(CommonAction.spatialRelations.add(spatialRelation));

		layers.push(
			{
				key: beforeLayerTemplateKey,
				layerTemplateKey: beforeLayerTemplateKey,
				name: 'geometryBefore',
				options: {},
				filterByActive: {
					layerTemplate: beforeLayerTemplateKey
				}
			}
		)
	}

	if(activeMapBorderState.after) {
		const spatialDataSource = getVectorSpatialDataSource(spatialDataSourceKey, JSON.parse(geometryAfter), 'geometryAfter');
		dispatch(CommonAction.spatialDataSources.add(spatialDataSource));

		const spatialRelation = getSpatialRelation(spatialDataSourceKey, spatialRelationKey, afterLayerTemplateKey);
		dispatch(CommonAction.spatialRelations.add(spatialRelation));

		layers.push(
			{
				key: afterLayerTemplateKey,
				layerTemplateKey: afterLayerTemplateKey,
				name: 'geometryBefore',
				options: {},
				filterByActive: {
					layerTemplate: afterLayerTemplateKey
				}
			}
		)
	}
	////// END Sync overlays to map part
	
	////// Sync active layers to map part
	const activeLayers = Select.components.get(state, 'szifZmenovaRizeni_ActiveLayers', activeMapKey);
	
	activeLayers.forEach((layer) => {
		layers.push(getLayerConfig(layer, dispatch));
	})

	////// END Sync active layers to map part
	dispatch(CommonAction.maps.setMapLayers(activeMapKey, layers));
	
}

szifLpisZmenovaRizeni['applyView'] = applyView;
szifLpisZmenovaRizeni['setInitMapBorderView'] = setInitMapBorderView;
szifLpisZmenovaRizeni['setInitMapOnBorderOverlays'] = setInitMapOnBorderOverlays;
szifLpisZmenovaRizeni['setInitMapActiveLayers'] = setInitMapActiveLayers;
szifLpisZmenovaRizeni['updateMap'] = updateMap;
szifLpisZmenovaRizeni['saveView'] = saveView;
szifLpisZmenovaRizeni['toggleLayer'] = toggleLayer;

export default {
	...CommonAction,
	specific: {
		lpisChangeCases,
		lpisChangeCasesEdited,
		lpisChangeDates,
		szifLpisZmenovaRizeni
	}
}