import React from "react";
import PropTypes from 'prop-types';
import {withNamespaces} from "react-i18next";

import DefaultLayerTree from './layerTreePresentation';

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
    
    componentDidUpdate(prevProps) {
        if(typeof this.props.ensureLayersTemplates === 'function') {
            this.props.ensureLayersTemplates(prevProps.layersTemplatesKeys, this.props.layersTemplatesKeys);
        }
    }

    render () {
        const childrensTrees = React.Children.map(this.props.children, (children) => 
            React.cloneElement(children, { ...this.props })
        );


        return (
                    <div>
                        {childrensTrees ? childrensTrees : <DefaultLayerTree {...this.props}/>}
                    </div>
        )
    }
}


LayersTree.defaultProps = {
    layersTree: [],
    layersTemplatesKeys: [],
    layersTreeKey: '',
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
    visibleLayersKeys: PropTypes.array,
};

export default withNamespaces()(LayersTree);