import {isArray} from 'lodash';
import {isObject} from 'lodash';

/**
 * 
 * @param {Array<Object>} layersTreeState 
 * @param {string} folderKey 
 * @returns {Object}
 */
export const getFolderByKey = (layersTreeState = [], folderKey) => {
    for (const item of layersTreeState) {
        if(item && item.type === 'folder' && item.key === folderKey) {
            return item;
        }

        if(item.type === 'folder') {
            const foundFolder = getFolderByKey(item.items, folderKey);
            if (foundFolder) {
                return foundFolder;
            }
        }
    }

};

/**
 * 
 * @param {Array<Object>} layersTree 
 * @param {string} layerKey
 * @returns {Object|null} 
 */
export const getFolderByLayerKey = (layersTree, layerKey) => {
    //layersTree = [] || {}

    if(isArray(layersTree)) {
        for (const item of layersTree) {
            const folder = getFolderByLayerKey(item, layerKey);
            if (folder) {
                return folder;
            }
        }
    }

    if(isObject(layersTree)) {
        //check if some child layer has same key
        if(layersTree && layersTree.type === 'folder') {
            const containsLayer = layersTree.items.some((item) => item.key === layerKey);
            if (containsLayer) {
                return layersTree;
            }

            for (const item of layersTree.items) {
                if(item.type === 'folder') {
                    const foundFolder = getFolderByLayerKey(item, layerKey);
                    if (foundFolder) {
                        return foundFolder;
                    }
                }
            }
        } else {
            return null;
        }
    }
};

/**
 * Return all 'layerTemplate' from folder on root level
 * @param {*} folder 
 * @returns {Array}
 */
export const getLayersInFolder = (folder = {}) => {
    if (folder && folder.type === 'folder' && folder.items.length > 0) {
        const layers = folder.items.reduce((acc, item) => {
            if(item.type === 'layerTemplate') {
                return [...acc, item];
            } else {
                return acc;
            }
        }, [])
        return layers;
    } else {
        return [];
    }
}

/**
 * Return ordered layers from given layerTree from bottom to top.
 * @param {*} layersTree 
 * @returns {Array}
 */
export const getFlattenLayers = (layersTree = []) => {
    const layers = layersTree.reduce((acc, item) => {
        switch (item.type) {
            case 'folder':
                return [...acc, ...getFlattenLayers(item.items)];
            case 'layerTemplate':
                return [...acc, item];
            default:
                return acc;
        }
    }, [])
    return layers.reverse();
}

/**
 * Get z-index for layer from layerTree
 * @param {*} layersTree 
 * @param {*} layerTemplateKey 
 * @returns {Number}
 */
export const getLayerZindex = (layersTree, layerTemplateKey) => {
    const flattenLayers = getFlattenLayers(layersTree);
    const zIndex = flattenLayers.findIndex((l) => l.key === layerTemplateKey);
    return zIndex || 0;
}

/**
 * Iterate over all tree leaf that are not folder
 * @param {Object} layerTree 
 * @param {function} callback 
 */
const forAllTreeItems = (layerTree = [], callback) => {
	layerTree.forEach((item) => {
		if(item.type === 'folder') {
			forAllTreeItems(item.items, callback);
		} else {
			callback(item);
		}
	});
};
/**
 * Merge data from layerTemplates, layersTree and map
 * @param {Array.<Object>} layersTrees 
 * @param {Array.<Object>} layerTemplates 
 * @param {Array.<Object>} layers 
 * @param {string} layersTreeKey 
 */
export const getLayersTreesConfig = (layersTrees, layerTemplates, layers, layersTreeKey) => {
	const layersTree = layersTrees ? layersTrees[layersTreeKey] : [];
	forAllTreeItems(layersTree, (item) => {
		if(item && item.type === 'layerTemplate') {
			//find layer with same layerTemplateKey as key in layersTree
			const layerInMap = layers.find(l => l.filter.layerTemplateKey.indexOf(item.key) === 0);

			item.visible = !!layerInMap;
			item.layerKey = layerInMap ? layerInMap.data.key : null; //mapLayerKey
			if(layerTemplates) {
				item.title = layerTemplates[item.key] ? layerTemplates[item.key].data.nameDisplay : 'placeholder';
			}
		}
	})
	return [...layersTree];
};