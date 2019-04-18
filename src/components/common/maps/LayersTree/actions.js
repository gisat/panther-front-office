import ActionTypes from '../../../../constants/ActionTypes';
import Select from '../../../../state/Select';
import cloneDeep from 'lodash/cloneDeep';
import {getFolderByLayerKey, getFolderByKey, getLayersInFolder}  from '../../../../utils/layerTreeUtils';
import mapsActions from '../../../../state/Maps/actions';
import Actions from '../../../../state/Action';

// ============ creators ===========
const hideRadioFolderLayersByLayerTemplateKey = (layersTree, layerTemplateKey, mapKey) => {
    return (dispatch) => {
        const parentFolder = getFolderByLayerKey(layersTree, layerTemplateKey);
        if(parentFolder && parentFolder.radio) {
            dispatch(hideLayersInFolder(parentFolder, mapKey));
        }
    }
};

const hideLayersInFolder = (parentFolder, mapKey) => {
    return (dispatch) => {
        const layers = getLayersInFolder(parentFolder)
        const visibleLayers = layers.filter(l => l.visible);
        //hide all visible layers (should be only one)
        visibleLayers.forEach((l) => {
            dispatch(mapsActions.removeLayer(mapKey, l.layerKey));
        })
    }
}
const setFolderVisibility = (layersTreeKey, folderKey, visibility, componentKey) => {
    return (dispatch, getState) => {
        const state = getState();
        const layersTrees = Select.components.getDataByComponentKey(state, componentKey);
        const layersTree = layersTrees[layersTreeKey];
        if(layersTree) {
            const folder = getFolderByKey(layersTree, folderKey);
            folder.expanded = visibility;
            const updatedLayersTree = cloneDeep(layersTree);
            dispatch(updateLayersTree(layersTreeKey, updatedLayersTree, componentKey));
        }
    }
}

function updateLayersTree(layersTreeKey, tree, componentKey) {
	return (dispatch, getState) => {
        const state = getState();
        let componentState = Select.components.getDataByComponentKey(state, componentKey) || {};

        const layersTreeKeyInitialized = Object.keys(componentState).includes(layersTreeKey);
        if (!layersTreeKeyInitialized) {
            componentState = {...componentState, [layersTreeKey]: {}};
        }

        const updateTree = {...componentState, [layersTreeKey]: tree};
        return dispatch(update(componentKey, updateTree));
	};
}

const ensureData = (layerTreesFilter, componentId, layersTreeKey) => {
    return (dispatch, getState) => {
        return dispatch(Actions.layersTrees.ensureData(layerTreesFilter, componentId)).then(() => {            
            const state = getState();
            const tree = Select.layersTrees.getByFilterOrder(state, layerTreesFilter, null);
            dispatch(updateLayersTree(layersTreeKey, tree[0].data.structure[0], 'LayersTree_demo'));
        });
    }
}

// ============ actions ===========
    function update(componentKey, tree) {
        return dispatch => {
            dispatch({
                type: ActionTypes.COMPONENTS.UPDATE,
                component: componentKey,
                update: tree,
            });
        };
    }

// ============ helpers ===========



// ============ export ===========

export default {
    ensureData,
    updateLayersTree,
    setFolderVisibility,
    hideLayersInFolder,
    hideRadioFolderLayersByLayerTemplateKey,
}
