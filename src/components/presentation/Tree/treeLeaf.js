import React from "react";
import PropTypes from "prop-types";
import './tree.css';
class TreeLeaf extends React.PureComponent {
    render() {
        return (
            <li className = {'leaf hover'} onClick={(evt) => {evt.preventDefault();this.props.onCheckClicked()}}>
                {
                    this.props.icon ? (
                        <span class="rc-tree-switcher rc-tree-switcher-noop">
                            {this.props.icon}
                        </span>) : null
                }
                {
                    <input type={this.props.type} checked={this.props.visible} onClick={(evt) => {evt.stopPropagation();}} onChange={(evt) => {this.props.onCheckClicked()}} /> //FIXME - add onChecked
                }
                <span className="title">
                    {this.props.title || 'placeholder'}
                </span>
            </li >
        )
    }
}


TreeLeaf.propTypes = {
    onCheckClicked: PropTypes.func,
    type: PropTypes.string,
    visible: PropTypes.bool,
}

export default TreeLeaf;