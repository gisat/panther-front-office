import React from "react";
import PropTypes from 'prop-types';

import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

import LayerTreeLeaf from './layerTreeLeaf';
import LayerTreeFolder from './layerTreeFolder';

import Icon from '../../../presentation/atoms/Icon'
import './layersTree.css';

// const getFolderByKey = (layersTreeState, folderKey) => {
//     for (const item of layersTreeState) {
//         if(item.type === 'folder' && item.key === folderKey) {
//             return item;
//         }

//         if(item.type === 'folder') {
//             const foundFolder = getFolderByKey(item.items, folderKey);
//             if (foundFolder) {
//                 return foundFolder;
//             }
//         }
//         // return item.type === 'folder' && item.key === folderKey ? item : getFolderByKey(item.items);
//     }
// }

// const getLayersTreeStateAfterFolderClick = (layersTreeState, folderKey) => {
//     // layersTreeState.
//     //--> drill and find folder
//     console.log(layersTreeState, folderKey, getFolderByKey(layersTreeState, folderKey));
    
// }
class LayersTree extends React.PureComponent {
    constructor() {
        super()

    }

    // getLayerTemplateByKey(layerTemplates, )

    getDescendant (descendant, parentProps) {
        switch (descendant.type) {
            case 'folder':
                return <LayerTreeFolder onClickExpand={() => {this.props.onLayerFolderExpandClick(this.props.layersTreeKey, descendant.key, !descendant.expanded)}} children={this.getDescendants(descendant.items, descendant)} key={descendant.id} {...descendant}/>
            case 'layerTemplate':
                const {type, ...leafProps} = descendant;
               return <LayerTreeLeaf 
                            onLayerVisibilityClick={() => {this.props.onLayerVisibilityClick(this.props.mapKey, descendant.key, descendant.layerKey, !leafProps.visible)}}
                            layerTemplate={this.props.layersTemplates[descendant.key]} 
                            key={descendant.key} 
                            type={parentProps && parentProps.radio ? 'radio' : 'checkbox'}
                            {...leafProps}/>
        }
    }
    getDescendants(structure, parentProps) {
        if(isArray(structure)) {
            return structure.map((item) => this.getDescendant(item, parentProps));
        }

        if(isObject(structure)) {
            return [this.getDescendant(structure, parentProps)];
        }
    }

    render () {
        // console.log(this.props.layersTemplates);
        
        // const structure = this.getDescendants(this.props.layersTree);

        return (
                this.props.layersTemplates ? (
                    <div>
                        <ul className={'gs-tree layersTree'}>
                            {this.getDescendants(this.props.layersTree)}
                        </ul>
                    </div>) : null
        )
    }
}


LayersTree.defaultProps = {
    layersTree: [],
    layersTreeKey: '',
    layersTemplates: [],
    onLayerFolderExpandClick: () => {},
    onLayerVisibilityClick: () => {},
  };
  
LayersTree.propTypes = {
    layersTree: PropTypes.array.isRequired,
    layersTreeKey: PropTypes.string.isRequired,
    onLayerFolderExpandClick: PropTypes.func,
    onLayerVisibilityClick: PropTypes.func,
    mapKey: PropTypes.string,
    // layersTemplates: PropTypes.object,
    // onLayerTamplateVisibilityChanged: PropTypes.function ,
};

export default LayersTree;