import React from "react";
import TreeLeaf from "components/presentation/Tree/treeLeaf";
import PropTypes from "prop-types";

class LayerTreeNode extends React.PureComponent {
    render() {
        //FIXME - remove
        const title = this.props.layerTemplate ? this.props.layerTemplate.data.nameDisplay : 'placeholder';
        return (
            <TreeLeaf onCheckClicked={this.props.onLayerVisibilityClick} title={title} {...this.props}/>
        )
    }
}

LayerTreeNode.propTypes = {
    onLayerVisibilityClick: PropTypes.func,
    type: PropTypes.string,
    visible: PropTypes.bool,
}

export default LayerTreeNode;