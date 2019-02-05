import React from "react";
import TreeLeaf from "../../../presentation/Tree/treeLeaf";
import PropTypes from "prop-types";

class LayerTreeNode extends React.PureComponent {
    constructor() {
        super();
    }

    onCheckClicked(evt) {
        console.log("leaf clicked");
    }


    render() {
        //FIXME - remove
        const title = this.props.layerTemplate ? this.props.layerTemplate.data.nameDisplay : 'placeholder';
        return (
            <TreeLeaf onCheckClicked={this.props.onLayerVisibilityClick} title={title} {...this.props}/>
        )
    }
}

LayerTreeNode.propTypes = {
    layerTemplate: PropTypes.object,
    onLayerVisibilityClick: PropTypes.func,
}

export default LayerTreeNode;