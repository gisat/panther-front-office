import React from "react";
import PropTypes from "prop-types";
import Button from "../../../../../../../../components/common/atoms/Button";

import './backgroundLayer.css';
class BackgroundLayer extends React.PureComponent {
    onItemClick(evt) {
        evt.preventDefault();

        //prevent click on active radio
        if (this.props.type === 'radio' && this.props.visible) {
            return;
        } else {
            this.props.onLeafClick();
        }
    }
    render() {
        return (
            <Button icon="plus" onClick={(evt) => this.onItemClick(evt)} ghost={!this.props.visible}>{this.props.title}</Button>
        )
    }
}


BackgroundLayer.propTypes = {
    onLeafClick: PropTypes.func,
    type: PropTypes.string,
    title: PropTypes.string,
    visible: PropTypes.bool,
}

export default BackgroundLayer;