import ActionTypes from '../../../constants/ActionTypes';
import Select from '../../Select';
import cloneDeep from 'lodash/cloneDeep';
import {getFolderByKey} from 'utils/tree'

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



// ============ export ===========

export default {
	setFolderVisibility,
}
