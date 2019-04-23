import React from "react";
import PropTypes from 'prop-types';
import {withNamespaces} from "react-i18next";

import LayerTreeLeaf from '../../../../../components/common/maps/LayersTree/layerTreeLeaf';
import BackgroundLayer from "./BackgroundLayer";

class BackgroundLayers extends React.PureComponent {

    getBackgroundLayers(layers = []) {
        return layers.map((layer) =>
            (<LayerTreeLeaf  
                {...layer}
                type={this.props.type === 'radio' ? 'radio' : 'checkbox'} 
                onLeafClick={() => {this.props.onLayerVisibilityClick(this.props.mapKey, layer.layerKey, layer.key, !layer.visible, this.props.layersTree)}}>
                    <BackgroundLayer />
            </LayerTreeLeaf>)
        )
    }


    render () {
        let t = this.props.t;

        const backgroundLayers = this.getBackgroundLayers(this.props.layersTree.backgroundLayers);
        return (
                    <div>
                        {
                            backgroundLayers ? backgroundLayers : null
                        }
                    </div>
        )
    }
}


BackgroundLayers.defaultProps = {
    layersTree: [],
    layersTemplatesKeys: [],
    layersTreeKey: '',
    onLayerFolderExpandClick: () => {},
    onLayerVisibilityClick: () => {},
    mapKey: '',
    type: 'checkbox',
  };
  
  BackgroundLayers.propTypes = {
    layersTemplatesKeys: PropTypes.array,
    layersTree: PropTypes.object.isRequired,
    layersTreeKey: PropTypes.string.isRequired,
    onLayerFolderExpandClick: PropTypes.func,
    onLayerVisibilityClick: PropTypes.func,
    ensureLayersTemplates: PropTypes.func,
    onUnmount: PropTypes.func,
    onMount: PropTypes.func,
    mapKey: PropTypes.string,
    visibleLayersKeys: PropTypes.array,
    type: PropTypes.string,
};

export default withNamespaces()(BackgroundLayers);