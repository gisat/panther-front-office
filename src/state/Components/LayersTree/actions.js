import ActionTypes from '../../../constants/ActionTypes';
import Select from '../../Select';
import cloneDeep from 'lodash/cloneDeep';

// ============ creators ===========
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
const getFolderByKey = (layersTreeState, folderKey) => {
    for (const item of layersTreeState) {
        if(item.type === 'folder' && item.key === folderKey) {
            return item;
        }

        if(item.type === 'folder') {
            const foundFolder = getFolderByKey(item.items, folderKey);
            if (foundFolder) {
                return foundFolder;
            }
        }
    }
}


// ============ export ===========

export default {
	setFolderVisibility,
}
