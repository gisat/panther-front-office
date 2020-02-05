import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";

import presentation from './presentation';

const componentID = 'szifZmenovaRizeni_SentinelExplorer';

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

	////// Sync active layers to map part
	const activeLayers = Select.components.get(state, componentID, `activeLayers.${mapKey}`);
	
	if(activeLayers && activeLayers.length > 0) {
		activeLayers.forEach((layer) => {
			layers.push(getLayerConfig(layer));
		})
	}

	////// END Sync active layers to map part
	return layers;
}

const mapStateToProps = (state, ownProps) => {
	const mapSetKey = Select.components.get(state, componentID, 'maps.activeSetKey');
	const mapSet = Select.components.get(state, componentID, `maps.sets.${mapSetKey}`);
	const activeMapKey = mapSet.activeMapKey;
	const mapsKeys = mapSet.maps;
	const maps = mapsKeys.map((mapKey, index) => {
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
		setActiveMapKey: (setKey, mapKey) => {
			dispatch(Action.components.set(componentID, `maps.sets.${setKey}.activeMapKey`, mapKey));
		},
		onViewChange: (setKey, view) => {
			dispatch(Action.components.set(componentID, `maps.sets.${setKey}.data.view`, view));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
