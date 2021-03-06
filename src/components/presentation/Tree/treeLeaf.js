import React from "react";
import PropTypes from "prop-types";
import './tree.css';
class TreeLeaf extends React.PureComponent {
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
            <li className = {'leaf hover'} onClick={(evt) => this.onItemClick(evt)}>
                {
                    this.props.icon ? (
                        <span class="rc-tree-switcher rc-tree-switcher-noop">
                            {this.props.icon}
                        </span>) : null
                }
                {
                    <input type={this.props.type} className={'hover'} checked={this.props.visible} onClick={(evt) => {evt.stopPropagation();}} onChange={(evt) => {this.props.onLeafClick()}} />
                }
                <span className="title">
                    {this.props.title || 'placeholder'}
                </span>
            </li >
        )
    }
}


TreeLeaf.propTypes = {
    onLeafClick: PropTypes.func,
    type: PropTypes.string,
    visible: PropTypes.bool,
}

export default TreeLeaf;