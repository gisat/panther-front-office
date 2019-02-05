import React from "react";
import TreeFolder from "../../../presentation/Tree/treeFolder";
import PropTypes from "prop-types";

class LayerTreeFolder extends React.PureComponent {
    constructor() {
        super();
    }

    render() {
        return (
            <TreeFolder onClickExpand={this.props.onClickExpand} {...this.props}/>
        )
    }
}

LayerTreeFolder.defaultProps = {
    expanded: false,
    onClickExpand: () => {
        
    },
}

LayerTreeFolder.propTypes = {
    expanded: PropTypes.bool,
    onClickExpand: PropTypes.func,
}

export default LayerTreeFolder;