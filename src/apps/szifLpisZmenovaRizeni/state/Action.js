import CommonAction from '../../../state/Action';
import Select from '../state/Select';

import lpisChangeCases from './LpisChangeCases/actions';
import lpisChangeCasesEdited from './LpisChangeCasesEdited/actions';

const szifLpisZmenovaRizeni = {};

const applyView = (viewKey) => (dispatch, getState) => {
	//apply default view
	if (!viewKey) {
		viewKey = Select.views.getActiveKey(getState());
		dispatch(CommonAction.views.apply(viewKey, CommonAction)).then(() => {
			dispatch(szifLpisZmenovaRizeni.setInitMapOnBorderOverlays());	
		});	
	} else {
		//get view
		dispatch(CommonAction.views.apply(viewKey, CommonAction));		
	}
};

//sync maps state with borders overlays component state
const setInitMapOnBorderOverlays = () => (dispatch, getState) => {
	const maps = Select.maps.getMapsAsObject(getState());
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

const updateMap = () => (dispatch, getState) => {
	const state = getState();
	const mapSetKey = Select.maps.getActiveSetKey(state);
	const activeMapKey = Select.maps.getMapSetActiveMapKey(state, mapSetKey);
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
szifLpisZmenovaRizeni['setInitMapOnBorderOverlays'] = setInitMapOnBorderOverlays;
szifLpisZmenovaRizeni['updateMap'] = updateMap;

export default {
	...CommonAction,
	specific: {
		lpisChangeCases,
		lpisChangeCasesEdited,
		szifLpisZmenovaRizeni
	}
}