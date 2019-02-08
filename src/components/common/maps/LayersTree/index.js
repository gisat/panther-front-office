import { connect } from 'react-redux';
import Select from 'state/Select';
import Action from 'state/Action';
import {getFolderByLayerKey, getLayersInFolder, getLayerZindex} from 'utils/tree'

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	const activeMapKey = Select.maps.getActiveMapKey(state);
	const layers = Select.maps.getAllLayersStateByMapKey(state, activeMapKey);
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
			if (visibility) {
				dispatch(Action.components.layersTree.hideRadioFolderLayersByLayerTemplateKey(layersTree, layerTemplateKey, mapKey));

				//addLayerWithIndex
				const zIndex = getLayerZindex(layersTree, layerTemplateKey);
				dispatch(Action.maps.addLayer(mapKey, {layerTemplate: layerTemplateKey}, zIndex));
			} else {
				dispatch(Action.maps.removeLayer(mapKey, layerKey));
			}
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
