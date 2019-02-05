import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	// const layersTrees = Select.components.getLayersTrees(state) || {};
	const activeMapKey = Select.maps.getActiveMapKey(state);

	let backgroundLayerState = Select.maps.getBackgroundLayerStateByMapKey(state, activeMapKey);
	let backgroundLayerData = backgroundLayerState ? [{filter: backgroundLayerState.mergedFilter, data: backgroundLayerState.layer}] : [];

	let layersState = Select.maps.getLayersStateByMapKey(state, activeMapKey);
	let layersData = layersState ? layersState.map(layer => {return {filter: layer.mergedFilter, data: layer.layer}}) : [];

	// const layers = Select.maps.getLayers(state, [...layersData, ...backgroundLayerData]);
	const layers = new Array(...layersData, ...backgroundLayerData);
	console.log(layers);
	
	// const activeMapLayers = Select.maps.getLayersStateByMapKey(state, activeMapKey) || [];
	// let backgroundLayerState = Select.maps.getBackgroundLayerStateByMapKey(state, activeMapKey);
	// // const activeMapBackgroundLayer = [Select.maps.getBackgroundLayer(state, backgroundLayerState ? backgroundLayerState.layerTemplate : null)] || [];
	// const activeMapBackgroundLayer = [Select.maps.getBackgroundLayerStateByMapKey(state, activeMapKey)] || [];
	// debugger
	// console.log([...activeMapLayers, ...activeMapBackgroundLayer]);

	const layersTree = Select.components.getLayersTreesConfig(state, layers, props.layersTreeKey, activeMapKey) || [];

	return {
		layersTreeKey: props.layersTreeKey,
		layersTree: layersTree,
		mapKey: activeMapKey,
		// layersTemplates: Select.layerTemplates.getAllAsObject(state),
		// activeMapLayers: [...activeMapLayers, ...activeMapBackgroundLayer],
		//mapLayers?
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLayerFolderExpandClick: (layersTreeKey, folderKey, visibility) => {
			// console.log(evt, key);
			// dispatch(Action.components.updateLayersTree(key, layerTree));
			dispatch(Action.components.layersTree.setFolderVisibility(layersTreeKey, folderKey, visibility));
			
		},
		onLayerVisibilityClick: (mapKey, layerTemplate, layerKey,  visibility) => {
			//FIXME - check parent radio
			if (visibility) {
				dispatch(Action.maps.addLayer(mapKey, {layerTemplate}));
			} else {
				dispatch(Action.maps.removeLayer(mapKey, layerKey));
			}
			//kontrola zda je ve složce radio

			//kontrola zda je background layer

			//potom dispatch add/remove
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
