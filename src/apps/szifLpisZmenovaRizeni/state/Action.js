import * as turf from '@turf/turf'
import CommonAction from '../../../state/Action';
import Select from '../state/Select';
import utils from '../../../utils/utils';

import lpisChangeCases from './LpisChangeCases/actions';
import lpisChangeCasesEdited from './LpisChangeCasesEdited/actions';

const szifLpisZmenovaRizeni = {};


const getViewState = (state) => {
	const maps = Select.maps.getSubstate(state);
	const szifZmenovaRizeni_BorderOverlays = Select.components.getDataByComponentKey(state, 'szifZmenovaRizeni_BorderOverlays');
	return {
		maps: maps, //remove borders layers from maps?
		components: {
			szifZmenovaRizeni_BorderOverlays
		}
	}
}

const applyView = (viewKey) => async (dispatch, getState) => {
	//apply default view
	if (!viewKey) {
		viewKey = Select.views.getActiveKey(getState());
		dispatch(CommonAction.views.apply(viewKey, CommonAction)).then(() => {
			dispatch(szifLpisZmenovaRizeni.setInitMapOnBorderOverlays());	
			dispatch(szifLpisZmenovaRizeni.setInitMapBorderView());	
		});
	} else {
		//get view
		await dispatch(CommonAction.views.useKeys([viewKey]));
		dispatch(CommonAction.views.apply(viewKey, CommonAction)).then(() => {
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

const getStatialDataSource = (spatialDataSourceKey, geometry, name) => {
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

const updateMap = (activeMapKey) => (dispatch, getState) => {
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
		const spatialDataSource = getStatialDataSource(spatialDataSourceKey, JSON.parse(geometryBefore), 'geometryBefore');
		dispatch(CommonAction.spatialDataSources.add(spatialDataSource));
		
		const spatialRelation = getSpatialRelation(spatialDataSourceKey, spatialRelationKey, beforeLayerTemplateKey);
		dispatch(CommonAction.spatialRelations.add(spatialRelation));

		layers.push(
			{
				key: beforeLayerTemplateKey,
				name: 'geometryBefore',
				options: {},
			}
		)
	}

	if(activeMapBorderState.after) {
		const spatialDataSource = getStatialDataSource(spatialDataSourceKey, JSON.parse(geometryAfter), 'geometryAfter');
		dispatch(CommonAction.spatialDataSources.add(spatialDataSource));

		const spatialRelation = getSpatialRelation(spatialDataSourceKey, spatialRelationKey, afterLayerTemplateKey);
		dispatch(CommonAction.spatialRelations.add(spatialRelation));

		layers.push(
			{
				key: afterLayerTemplateKey,
				name: 'geometryBefore',
				options: {},
			}
		)
	}
	
	dispatch(CommonAction.maps.setMapLayers(activeMapKey, layers));
	
}

szifLpisZmenovaRizeni['applyView'] = applyView;
szifLpisZmenovaRizeni['setInitMapBorderView'] = setInitMapBorderView;
szifLpisZmenovaRizeni['setInitMapOnBorderOverlays'] = setInitMapOnBorderOverlays;
szifLpisZmenovaRizeni['updateMap'] = updateMap;
szifLpisZmenovaRizeni['saveView'] = saveView;

export default {
	...CommonAction,
	specific: {
		lpisChangeCases,
		lpisChangeCasesEdited,
		szifLpisZmenovaRizeni
	}
}