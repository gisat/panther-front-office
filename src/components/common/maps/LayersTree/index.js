import { connect } from 'react-redux';
import Select from 'state/Select';
import Action from 'state/Action';
import utils from 'utils/utils';
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
		layersTemplates: Select.layerTemplates.getAllAsObject(state),
	}
};

const mapDispatchToProps = (dispatch) => {
	const componentId = 'LayerTemplatesSelector_' + utils.randomString(6);
	// const order = [[]];

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

		onMount: (layersIDs) => {
			debugger
			console.log("mount layersTree");
			dispatch(Action.layerTemplates.useIndexed(null, {key: {}}, undefined, 1, 1000, componentId));
			//load layersTree configuration
			//does map exists?
		},
		onUnmount: () => {
			dispatch(Action.layerTemplates.useIndexedClear(componentId));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
