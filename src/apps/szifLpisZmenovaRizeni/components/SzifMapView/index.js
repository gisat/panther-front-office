import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";

import presentation from './presentation';

const borderStyle = {
	"rules":[
		{
		  "styles":[
			{
				// fill: '',
				fillOpacity: 0,
				// outlineColor:
				outlineWidth: 2,
				outlineOpacity: 0.8,
			}
		  ]
		}
	  ]
}

const getSentinelRasterSpatialDataSource = (spatialDataSourceKey, name, time) => {
	return {
			key: spatialDataSourceKey,
			type: "wms",
			options: {
				"url": 'http://panther.gisat.cz/geoserver/wms',
				params: {
					layers: 'geonode:szif_sentinel2_2019_12_10_2017,geonode:szif_sentinel2_2019_12_10_2018,geonode:szif_sentinel2_2019_12_10_2019_without_06',
					time: time,		
				}
			}
	}
}

const getLayerConfig = (layer) => {
	if(layer && layer.options && layer.options.type && layer.options.type === 'sentinel') {
		return getSentinelRasterSpatialDataSource(layer.key,  'sentinel', layer.time);
	}
}

const getMapLayers = (state, mapKey) => {
	const layers = [];

	////// Boundaries layers
	const activeMapBorderState = Select.components.get(state, 'szifZmenovaRizeni_BorderOverlays', mapKey);
	const activeCase = Select.specific.lpisChangeCases.getActive(state);
	const geometryBefore = activeCase.data.geometryBefore;
	const geometryAfter = activeCase.data.geometryAfter;
	if(activeMapBorderState && activeMapBorderState.before) {
		layers.push(
			{
				key: 'before',
				name: 'geometryBefore',
				type: 'vector',
				options: {
					features: [{type:'feature', properties: {}, geometry: JSON.parse(geometryBefore)}],
					style: borderStyle,
				}
			}
		)
	}

	if(activeMapBorderState && activeMapBorderState.after) {
		layers.push(
			{
				key: 'after',
				name: 'geometryAfter',
				type: 'vector',
				options: {
					features: [{type:'feature', properties: {}, geometry: JSON.parse(geometryAfter)}],
					style: borderStyle,
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
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
