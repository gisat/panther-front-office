import React from "react";
import TreeLeaf from "../../../../components/presentation/Tree/treeLeaf";
import PropTypes from "prop-types";

class LayerTreeNode extends React.PureComponent {
    render() {
        //FIXME - remove
        const title = this.props.title ? this.props.title : 'placeholder';

        const leafProps = {
            onLeafClick: this.props.onLeafClick,
            visible: this.props.visible,
            type: this.props.type,
            title: title
        }

        const CustomChildren = this.props.children ? React.cloneElement(this.props.children, {...leafProps}) : null;

        return (
            CustomChildren ? CustomChildren : (<TreeLeaf {...leafProps}/>)
        )
    }
}

LayerTreeNode.propTypes = {
    onLeafClick: PropTypes.func,
    type: PropTypes.string,
    title: PropTypes.string,
    visible: PropTypes.bool,
}

export default LayerTreeNode;