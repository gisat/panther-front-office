import { connect } from 'react-redux';
import React from "react";
import Select from '../../../../state/Select';
import Action from '../../../../state/Action';
import ComponentAction from './actions';
import utils from '../../../../utils/utils';
import * as layerTreeUtils from '../../../../utils/layerTreeUtils';
import isEqual from 'lodash/isEqual';

import Presentation from './presentation';

// FIXME -> add support for control mapKey or mapSet

const mapStateToProps = (state, ownProps) => {
	//TODO merge to one selector
	const activeMapKey = Select.maps.getActiveMapKey(state);
	const mapLayers = Select.maps.getAllLayersStateByMapKey(state, activeMapKey);
	const layersTemplates = Select.layerTemplates.getAllAsObject(state);
	const layersTrees = Select.components.getDataByComponentKey(state, ownProps.componentKey) || {};
	const layersTree = layerTreeUtils.getLayersTreesConfig(layersTrees, layersTemplates, mapLayers, ownProps.layersTreeKey) || [];

	const layersTemplatesKeys = layerTreeUtils.getFlattenLayerTree(layersTree).map(l => l.key);
	
	return {
		layersTemplatesKeys,
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
			const isBackgroundLayer = layersTree.backgroundLayers && layersTree.backgroundLayers.some((l) => l.key === layerTemplateKey);
			if(isBackgroundLayer) {
				if (visibility) {
					dispatch(ComponentAction.hideRadioFolderLayersByLayerTemplateKey(layersTree, layerTemplateKey, mapKey));

					dispatch(Action.maps.setMapBackgroundLayer(mapKey, {key: layerKey, layerTemplate: layerTemplateKey}));
				} else {
					dispatch(Action.maps.setMapBackgroundLayer(mapKey, null));
				}
			} else {
				if (visibility) {
					dispatch(ComponentAction.hideRadioFolderLayersByLayerTemplateKey(layersTree, layerTemplateKey, mapKey));

					const zIndex = layerTreeUtils.getLayerZindex(layersTree, layerTemplateKey);
					dispatch(Action.maps.addLayer(mapKey, {key: layerKey, layerTemplate: layerTemplateKey}, zIndex));
				} else {
					dispatch(Action.maps.removeLayer(mapKey, layerKey));
				}
			}
		},
		onUnmount: () => {
			dispatch(Action.layerTemplates.useIndexedClear(componentId));
			dispatch(Action.layerTemplates.useKeysClear(componentId));
		},
		onMount: (props) => {
			const layerTreesFilter = props.layerTreesFilter;
			dispatch(ComponentAction.ensureData(layerTreesFilter, componentId, props.layersTreeKey));
		},

		ensureLayersTemplates(prevLayersTemplatesKeys, layersTemplatesKeys) {
			if (layersTemplatesKeys && layersTemplatesKeys.length > 0 && !isEqual(prevLayersTemplatesKeys, layersTemplatesKeys)) {
				dispatch(Action.layerTemplates.useKeys(layersTemplatesKeys, componentId));
			}
		}
	}
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Presentation);

ConnectedComponent.defaultProps = {
	layersTreeKey: utils.uuid(),
};

export default ConnectedComponent;
