import { connect } from 'react-redux';
import Select from 'state/Select';
import Action from 'state/Action';
import utils from 'utils/utils';
import {getLayerZindex, getFlattenLayers} from 'utils/tree'

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	const activeMapKey = Select.maps.getActiveMapKey(state);
	const layers = Select.maps.getAllLayersStateByMapKey(state, activeMapKey);
	const layersTree = Select.components.getLayersTreesConfig(state, layers, props.layersTreeKey, activeMapKey) || [];
	const flattenLayersTree = getFlattenLayers(layersTree).map(l => l.key);
	return {
		layersTemplatesKeys: flattenLayersTree,
		layersTreeKey: props.layersTreeKey,
		layersTree: layersTree,
		mapKey: activeMapKey,
		layersTemplates: Select.layerTemplates.getAllAsObject(state),
	}
};

const mapDispatchToProps = (dispatch) => {
	const componentId = 'LayerTemplatesSelector_' + utils.randomString(6);

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
		onUnmount: () => {
			dispatch(Action.layerTemplates.useIndexedClear(componentId));
		},
		ensureLayersTemplates: (layersTemplatesKeys) => {
			dispatch(Action.layerTemplates.useKeys(layersTemplatesKeys, componentId));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
