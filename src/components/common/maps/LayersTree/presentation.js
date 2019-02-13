import React from "react";
import PropTypes from 'prop-types';

import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isEqual from 'lodash/isEqual';

import LayerTreeLeaf from './layerTreeLeaf';
import LayerTreeFolder from './layerTreeFolder';

import './layersTree.css';

class LayersTree extends React.PureComponent {
    
	componentWillUnmount() {
		this.props.onUnmount();
	}

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps.layersTemplatesKeys, this.props.layersTemplatesKeys)) {
            this.props.ensureLayersTemplates(this.props.layersTemplatesKeys);
        }
    }

    getDescendant (descendant, parentProps) {
        switch (descendant.type) {
            case 'folder':
                return <LayerTreeFolder 
                            onClickExpand={() => {this.props.onLayerFolderExpandClick(this.props.layersTreeKey, descendant.key, !descendant.expanded)}} 
                            children={this.getDescendants(descendant.items, descendant)} 
                            key={descendant.id} 
                            {...descendant} />
            case 'layerTemplate':
                const {type, ...leafProps} = descendant;
               return <LayerTreeLeaf 
                            onLayerVisibilityClick={() => {this.props.onLayerVisibilityClick(this.props.mapKey, descendant.layerKey, descendant.key, !leafProps.visible, this.props.layersTree)}}
                            key={descendant.key}  //layerTemplateKey
                            type={parentProps && parentProps.radio ? 'radio' : 'checkbox'}
                            title={leafProps.title}
                            visible={leafProps.visible} />
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
    layersTemplatesKeys: [],
    layersTreeKey: '',
    layersTemplates: {},
    onLayerFolderExpandClick: () => {},
    onLayerVisibilityClick: () => {},
    mapKey: '',
  };
  
LayersTree.propTypes = {
    layersTemplatesKeys: PropTypes.array,
    layersTree: PropTypes.array.isRequired,
    layersTreeKey: PropTypes.string.isRequired,
    onLayerFolderExpandClick: PropTypes.func,
    onLayerVisibilityClick: PropTypes.func,
    ensureLayersTemplates: PropTypes.func,
    onUnmount: PropTypes.func,
    mapKey: PropTypes.string,
    layersTemplates: PropTypes.object,
};

export default LayersTree;