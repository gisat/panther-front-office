import {isArray, isObject} from 'lodash';

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
 * @param {Array<Object> | Object} layersTree 
 * @param {string} layerKey
 * @returns {Object|null} 
 */
export const getFolderByLayerKey = (layersTree, layerKey) => {

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

    const flatLayers = (branch) => branch.reduce((acc, item) => {
        switch (item.type) {
            case 'folder':
                return [...acc, ...flatLayers(item.items)];
            case 'layerTemplate':
                return [...acc, item];
            default:
                return acc;
        }
    }, [])

    return [
        ...flatLayers(layersTree).reverse()
    ]
}

/**
 * Get z-index for layer from layerTree
 * @param {*} layersTree 
 * @param {*} layerTemplateKey 
 * @returns {Number}
 */
export const getLayerZindex = (layersTree, layerTemplateKey) => {
    const layerTreeKeys = Object.entries(layersTree);
    const flattenLayers = layerTreeKeys.reduce((acc, val) => {
        const [key, tree] = val;
        const flattenLayers = getFlattenLayers(tree);
        return [...acc, ...flattenLayers];
    }, [])
    const zIndex = flattenLayers.findIndex((l) => l.key === layerTemplateKey);
    return zIndex || 0;
}

/**
 * Iterate over all tree leaf that are not folder
 * @param {Object} layerTree 
 * @param {function} callback 
 */
const forAllTreeItems = (layerTree = [], callback) => {
	return layerTree.reduce((accumulator, item) => {
		if(item.type === 'folder') {
			return forAllTreeItems(item.items, callback);
		} else {
            const transformed = callback(item);
            if(transformed) {
                return [...accumulator, transformed];
            } else {
                return accumulator;
            }
		}
	}, []);
};
/**
 * Merge data from layerTemplates, layersTree and map
 * @param {Array.<Object>} layersTrees 
 * @param {Array.<Object>} layerTemplates 
 * @param {Array.<Object>} layers 
 * @param {string} layersTreeKey 
 */
export const getLayersTreesConfig = (layersTrees, layerTemplates, mapLayers, layersTreeKey) => {
    const layersTree = layersTrees ? layersTrees[layersTreeKey] : [];
	return forAllTreeItems(layersTree, (item) => {
		if(item && item.type === 'layerTemplate') {
            const itemConfig = {...item};
            if(Object.keys(layerTemplates).length > 0) {
                const itemInLayerTemplates = layerTemplates[itemConfig.key];

                if (!itemInLayerTemplates || itemInLayerTemplates && itemInLayerTemplates.hasOwnProperty('unreceived') && itemInLayerTemplates.unreceived === true) {
                    //hide item if not in layerTemplates
                    itemConfig.notAllowed = true;
                    
                    return;
                } else {
                    itemConfig.title = layerTemplates[itemConfig.key] ? layerTemplates[itemConfig.key].data.nameDisplay : 'placeholder';
                }
            }

			//find layer with same layerTemplateKey as key in layersTree
			const layerInMap = mapLayers.find(l => l.filter.layerTemplateKey && l.filter.layerTemplateKey.indexOf(itemConfig.key) === 0);

			itemConfig.visible = !!layerInMap;
            itemConfig.layerKey = layerInMap ? layerInMap.data.key : null; //mapLayerKey
            
            return itemConfig;
		}
	})
};