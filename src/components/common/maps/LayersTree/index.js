import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from '../../../../state/Action';
import ComponentAction from './actions';
import utils from '../../../../utils/utils';
import {getLayerZindex, getFlattenLayers, getLayersTreesConfig} from '../../../../utils/tree'

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	const activeMapKey = Select.maps.getActiveMapKey(state);
	const layers = Select.maps.getAllLayersStateByMapKey(state, activeMapKey);
	const layersTemplates = Select.layerTemplates.getAllAsObject(state);
	const layersTrees = Select.components.getDataByComponentKey(state, ownProps.componentKey);
	const layersTree = getLayersTreesConfig(layersTrees, layersTemplates, layers, ownProps.layersTreeKey) || [];
	const flattenLayersTree = getFlattenLayers(layersTree).map(l => l.key);
	return {
		layersTemplatesKeys: flattenLayersTree,
		layersTreeKey: ownProps.layersTreeKey,
		layersTree: layersTree,
		mapKey: activeMapKey,
		layersTemplates: Select.layerTemplates.getAllAsObject(state),
	}
};

const mapDispatchToProps = (dispatch, props) => {
	const componentId = 'LayerTemplatesSelector_' + utils.randomString(6);

	return {
		onLayerFolderExpandClick: (layersTreeKey, folderKey, visibility) => {
			dispatch(ComponentAction.setFolderVisibility(layersTreeKey, folderKey, visibility, props.componentKey));
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
				dispatch(ComponentAction.hideRadioFolderLayersByLayerTemplateKey(layersTree, layerTemplateKey, mapKey));

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
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
