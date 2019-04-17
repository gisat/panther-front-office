import { connect } from 'react-redux';
import React from "react";
import Select from '../../../../state/Select';
import Action from '../../../../state/Action';
import ComponentAction from './actions';
import Actions from '../../../../state/Action';
import utils from '../../../../utils/utils';
import {getLayerZindex, getFlattenLayers, getLayersTreesConfig} from './utils'
import isEqual from 'lodash/isEqual';

import Presentation from './presentation';

// import layerTree from './layersTreeConfig_radio'; //test data
// import layerTree from './layersTreeConfig'; //test data
import layerTree from '../../../../apps/demo/layersTreeConfig_root'; //test data

const mapStateToProps = (state, ownProps) => {
	//TODO merge to one selector
	const activeMapKey = Select.maps.getActiveMapKey(state);
	const mapLayers = Select.maps.getAllLayersStateByMapKey(state, activeMapKey);
	const layersTemplates = Select.layerTemplates.getAllAsObject(state);
	const layersTrees = Select.components.getDataByComponentKey(state, ownProps.componentKey);
	const layersTree = getLayersTreesConfig(layersTrees, layersTemplates, mapLayers, ownProps.layersTreeKey) || [];
	const layersTemplatesKeys = getFlattenLayers(layersTree).map(l => l.key);
	const visibleLayersKeys = layersTrees ? getFlattenLayers(layersTrees[ownProps.layersTreeKey]).filter((l) => l.visible && layersTemplatesKeys.includes(l.key)).map(l => l.key) : [];
	
	return {
		layersTemplatesKeys,
		layersTreeKey: ownProps.layersTreeKey,
		layersTree: layersTree,
		mapKey: activeMapKey,
		layersTemplates: Select.layerTemplates.getAllAsObject(state),
		visibleLayersKeys,
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
				dispatch(Action.maps.addLayer(mapKey, {key: layerKey, layerTemplate: layerTemplateKey}, zIndex));
			} else {
				dispatch(Action.maps.removeLayer(mapKey, layerKey));
			}
		},
		onUnmount: () => {
			dispatch(Action.layerTemplates.useIndexedClear(componentId));
		},
		onMount: (props) => {
			const {visibleLayersKeys, layersTree} = props;
			
			//If layer visible in layersTree, add to active mapSet
			for (const layerKey of visibleLayersKeys) {
				const zIndex = getLayerZindex(layersTree, layerKey);
				//add to each map
				dispatch(Action.maps.addLayerToEachMapInSet({layerTemplate: layerKey}, zIndex));
			}
			
		},

		onWrapperMount(componentKey, layersTreeKey) {
			//TODO load layersTree from BE
			// dispatch(ComponentAction.updateLayersTree(layersTreeKey, layerTree, 'LaersTree_demo'));
			
			//load layersTree
				// dispatch(ComponentAction.prepareLayersTreeComponentState(componentKey, layersTreeKey));
				// dispatch(ComponentAction.ensureLayerTree(componentKey, layersTreeKey));
				// dispatch(Action.layersTrees.useIndexed({application: true, scope: true}, null, null, 1, 1000, componentId));
				//then
		},

		ensureLayersTemplates: (layersTemplatesKeys) => {
			dispatch(Action.layerTemplates.useKeys(layersTemplatesKeys, componentId));
		},
	}
};

class LayersTreeWrapper extends React.PureComponent {
	render() {
		const {layersTree, layersTemplates} = this.props;
		const loadedLayersTemplates = Object.keys(layersTemplates);
		
		return (
			<>
				{layersTree.length > 0 && loadedLayersTemplates.length > 0 ? <Presentation {...this.props}/> : null}
			</>
		)
	}

	componentDidMount() {
		if(typeof this.props.onWrapperMount === 'function') {
			this.props.onWrapperMount(this.props.componentKey, this.props.layersTreeKey);
		}
	}

	componentDidUpdate(prevProps) {
        if (!isEqual(prevProps.layersTemplatesKeys, this.props.layersTemplatesKeys)) {
            this.props.ensureLayersTemplates(this.props.layersTemplatesKeys);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayersTreeWrapper);
