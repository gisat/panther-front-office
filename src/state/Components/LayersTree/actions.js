import ActionTypes from '../../../constants/ActionTypes';
import Select from '../../Select';
import cloneDeep from 'lodash/cloneDeep';
import {getFolderByLayerKey, getFolderByKey, getLayersInFolder} from 'utils/tree';
import mapsActions from 'state/Maps/actions';

// ============ creators ===========
const hideRadioFolderLayersByLayerTemplateKey = (layersTree, layerTemplateKey, mapKey) => {
    return (dispatch, getState) => {
        const parentFolder = getFolderByLayerKey(layersTree, layerTemplateKey);
        if(parentFolder && parentFolder.radio) {
            dispatch(hideLayersInFolder(parentFolder, mapKey));
        }
    }
};

const hideLayersInFolder = (parentFolder, mapKey) => {
    return (dispatch, getState) => {
        const layers = getLayersInFolder(parentFolder)
        const visibleLayers = layers.filter(l => l.visible);
        //hide all visible layers (should be only one)
        visibleLayers.forEach((l) => {
            dispatch(mapsActions.removeLayer(mapKey, l.layerKey));
        })
    }
}
const setFolderVisibility = (layersTreeKey, folderKey, visibility) => {
    return (dispatch, getState) => {
        const state = getState();
        const layersTrees = Select.components.getLayersTrees(state, layersTreeKey);
        const layersTree = layersTrees[layersTreeKey];
        if(layersTree) {
            const folder = getFolderByKey(layersTree, folderKey);
            folder.expanded = visibility;
            const updatedLayersTree = cloneDeep(layersTree);
            dispatch(actionUpdate(layersTreeKey, updatedLayersTree));
        }
    }
}
// ============ actions ===========

function actionUpdate(layersTreeKey, tree) {
	return {
        type: ActionTypes.COMPONENTS_LAYERSTREE_UPDATE,
        layersTreeKey: layersTreeKey,
        update: tree,
    }
}


// ============ helpers ===========



// ============ export ===========

export default {
    setFolderVisibility,
    hideLayersInFolder,
    hideRadioFolderLayersByLayerTemplateKey,
}
