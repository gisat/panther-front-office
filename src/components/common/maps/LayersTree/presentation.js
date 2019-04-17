import React from "react";
import PropTypes from 'prop-types';
import {withNamespaces} from "react-i18next";

import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

import LayerTreeLeaf from './layerTreeLeaf';
import LayerTreeFolder from './layerTreeFolder';

import './layersTree.css';

class LayersTree extends React.PureComponent {
    
	componentWillUnmount() {
		this.props.onUnmount();
	}
	componentDidMount() {
        if(typeof this.props.onMount === 'function') {
            this.props.onMount(this.props);
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
                const {type, notAllowed, ...leafProps} = descendant;
                return notAllowed ? null : (<LayerTreeLeaf 
                            onLayerVisibilityClick={() => {this.props.onLayerVisibilityClick(this.props.mapKey, descendant.layerKey, descendant.key, !leafProps.visible, this.props.layersTree)}}
                            key={descendant.key}  //layerTemplateKey
                            type={parentProps && parentProps.radio ? 'radio' : 'checkbox'}
                            title={leafProps.title}
                            visible={leafProps.visible} />
                        )
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
        let t = this.props.t;
        return (
                this.props.layersTemplates ? (
                    <div>
                        {
                            this.props.layersTree.layers ? 
                                (
                                <>
                                    <h3>{t("layers.layers")}</h3>
                                    <ul className={'ptr-tree layersTree'}>
                                        {this.getDescendants(this.props.layersTree.layers)}
                                    </ul>
                                </>
                                ) : null
                        }
                        {
                            this.props.layersTree.backgroundLayers ? 
                                (
                                <>
                                    <h3>{t("layers.backgroundLayer_plural")}</h3>
                                    <ul className={'ptr-tree layersTree'}>
                                        {this.getDescendants(this.props.layersTree.backgroundLayers)}
                                    </ul>
                                </>
                                ) : null
                        }
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
    layersTree: PropTypes.object.isRequired,
    layersTreeKey: PropTypes.string.isRequired,
    onLayerFolderExpandClick: PropTypes.func,
    onLayerVisibilityClick: PropTypes.func,
    ensureLayersTemplates: PropTypes.func,
    onUnmount: PropTypes.func,
    onMount: PropTypes.func,
    mapKey: PropTypes.string,
    layersTemplates: PropTypes.object,
    visibleLayersKeys: PropTypes.array,
};

export default withNamespaces()(LayersTree);