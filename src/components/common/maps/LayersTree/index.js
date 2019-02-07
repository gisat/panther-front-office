import { connect } from 'react-redux';
import Select from 'state/Select';
import Action from 'state/Action';
import {getFolderByLayerKey, getLayersInFolder, getLayerZindex} from 'utils/tree'

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	const activeMapKey = Select.maps.getActiveMapKey(state);

	const backgroundLayerState = Select.maps.getBackgroundLayerStateByMapKey(state, activeMapKey);
	const backgroundLayerData = backgroundLayerState ? [{filter: backgroundLayerState.mergedFilter, data: backgroundLayerState.layer}] : [];

	const layersState = Select.maps.getLayersStateByMapKey(state, activeMapKey);
	const layersData = layersState ? layersState.map(layer => {return {filter: layer.mergedFilter, data: layer.layer}}) : [];
	const layers = new Array(...layersData, ...backgroundLayerData);
	
	const layersTree = Select.components.getLayersTreesConfig(state, layers, props.layersTreeKey, activeMapKey) || [];
	//FIXME - load layersTemplates
	return {
		layersTreeKey: props.layersTreeKey,
		layersTree: layersTree,
		mapKey: activeMapKey,
		// layersTemplates: Select.layerTemplates.getAllAsObject(state),
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLayerFolderExpandClick: (layersTreeKey, folderKey, visibility) => {
			dispatch(Action.components.layersTree.setFolderVisibility(layersTreeKey, folderKey, visibility));
		},
		/**
		 * {string} mapKey - keyFromMap
		 * {string} layerKey - keyFromLayer
		 * {string} layerTemplateKey - keyFromLayerTemplate
		 * {bool} visibility - new layer visibility
		 * {Array} layersTree - tree definition
		 * 
		 */
		onLayerVisibilityClick: (mapKey, layerKey, layerTemplateKey, visibility, layersTree) => {
			//FIXME - special behaviour for background layers?
			const parentFolder = getFolderByLayerKey(layersTree, layerTemplateKey);
			if(parentFolder && parentFolder.radio) {
				const layers = getLayersInFolder(parentFolder)
				const visibleLayers = layers.filter(l => l.visible);
				//hide all visible layers (should be only one)
				visibleLayers.forEach((l) => {
					dispatch(Action.maps.removeLayer(mapKey, l.layerKey));
				})
			}

			if (visibility) {
				const zIndex = getLayerZindex(layersTree, layerTemplateKey);
				dispatch(Action.maps.addLayer(mapKey, {layerTemplate: layerTemplateKey}, zIndex));
			} else {
				dispatch(Action.maps.removeLayer(mapKey, layerKey));
			}
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
