import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";

import presentation from './presentation';

const borderStyleBefore = {
	"rules":[
		{
		  "styles":[
			{
				// fill: '',
				fillOpacity: 0,
				outlineColor: '#ff0000',
				outlineWidth: 2,
				outlineOpacity: 0.8,
			}
		  ]
		}
	  ]
};

const borderStyleAfter = {
	"rules":[
		{
		  "styles":[
			{
				// fill: '',
				fillOpacity: 0,
				outlineColor: '#f3cd19',
				outlineWidth: 2,
				outlineOpacity: 0.8,
			}
		  ]
		}
	  ]
}

const getSentinelRasterSpatialDataSource = (spatialDataSourceKey, name, time, layer) => {
	return {
			key: spatialDataSourceKey,
			type: "wms",
			options: {
				url: layer.options.url,
				params: {
					...layer.options.params,
					layers: layer.options.layers,
					time: layer.time,
				}
			}
	}
}

const getWMSRasterSpatialDataSource = (layer) => {
	return {
			key: layer.key,
			type: "wms",
			options: {
				"url": layer.options.url,
				params: {
					...layer.options.params
				}
			}
	}
}

const getLayerConfig = (layer) => {
	if(layer && layer.options && layer.options.type && layer.options.type === 'sentinel') {
		return getSentinelRasterSpatialDataSource(layer.key,  'sentinel', layer.time, layer);
	}

	if(layer && layer.options && layer.options.type && layer.options.type === 'wms') {
		return getWMSRasterSpatialDataSource(layer);
	}
}

const getMapLayers = (state, mapKey) => {
	const layers = [];

	////// Boundaries layers
	const activeMapBorderState = Select.components.get(state, 'szifZmenovaRizeni_BorderOverlays', mapKey);
	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	const geometryBefore = activeCase.data.geometryBefore;
	const geometryAfter = activeCase.data.geometryAfter;
	if(activeMapBorderState && activeMapBorderState.before && geometryBefore) {
		layers.push(
			{
				key: 'before',
				name: 'geometryBefore',
				type: 'vector',
				options: {
					features: [{type:'feature', properties: {}, geometry: JSON.parse(geometryBefore)}],
					style: borderStyleBefore,
				}
			}
		)
	}

	if(activeMapBorderState && activeMapBorderState.after && geometryAfter) {
		layers.push(
			{
				key: 'after',
				name: 'geometryAfter',
				type: 'vector',
				options: {
					features: [{type:'feature', properties: {}, geometry: JSON.parse(geometryAfter)}],
					style: borderStyleAfter,
				}
			}
		)
	}


	////// END Boundaries layers

	////// Sync active layers to map part
	const activeLayers = Select.components.get(state, 'szifZmenovaRizeni_ActiveLayers', mapKey);
	
	if(activeLayers && activeLayers.length > 0) {
		activeLayers.forEach((layer) => {
			layers.push(getLayerConfig(layer));
		})
	}

	////// END Sync active layers to map part
	return layers;
}

const mapStateToProps = (state, ownProps) => {
	const mapSetKey = Select.maps.getActiveSetKey(state);
	const mapSet = Select.maps.getMapSetByKey(state, mapSetKey);
	const activeMapKey = Select.maps.getMapSetActiveMapKey(state, mapSetKey);
	const mapsKeys = Select.maps.getMapSetMapKeys(state, mapSetKey) || [];
	const maps = mapsKeys.map((mapKey, index) => {
		// const map = Select.maps.getMapByKey(state, mapKey);
		const map = {
			key: mapKey,
		};
		map.layers = getMapLayers(state, mapKey);
		map.label = `Mapa ${index + 1}`;
		return map;
	});

	return {
		activeMapKey,
		backgroundLayer: mapSet && mapSet.data && mapSet.data.backgroundLayer,
		maps: maps,
		mapSetKey,
		view: mapSet && mapSet.data && mapSet.data.view
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		switchScreen: () => {
			dispatch(Action.components.set('szifScreenAnimator', 'activeScreenKey', 'szifCaseList'));
		},
		setActiveMapKey: (setKey, mapKey) => {
			dispatch(Action.maps.setMapSetActiveMapKey(mapKey));
		},
		onViewChange: (setKey, view) => {
			dispatch(Action.maps.setSetView(setKey, view));
		},
		onUnMount: () => {
			//clear edited active case
			dispatch(Action.specific.lpisChangeCases.removeEditedActive())
			dispatch(Action.specific.lpisChangeCases.setActiveKey(undefined));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
