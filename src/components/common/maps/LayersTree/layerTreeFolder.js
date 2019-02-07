import React from "react";
import TreeFolder from "components/presentation/Tree/treeFolder";
import PropTypes from "prop-types";

class LayerTreeFolder extends React.PureComponent {
    render() {
        return (
            <TreeFolder {...this.props}/>
        )
    }
}

LayerTreeFolder.defaultProps = {
    expanded: false,
    onClickExpand: () => {},
    children: [],
    title: '',
}

LayerTreeFolder.propTypes = {
    expanded: PropTypes.bool,
    onClickExpand: PropTypes.func,
    children: PropTypes.arrayOf(PropTypes.element),
    title: PropTypes.string,
    // icon: PropTypes.element
}

export default LayerTreeFolder;