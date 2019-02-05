import React from "react";
import './tree.css';
class TreeLeaf extends React.PureComponent {
    constructor() {
        super();
    }

    // props.icon
    // props.type
    // props.checked
    // props.title
    // props.onCheckClick 

    // collapsed
    // onCollapsedClick
    render() {
        return (
            <li className = {'leaf'}>
                {
                    this.props.icon ? (
                        <span class="rc-tree-switcher rc-tree-switcher-noop">
                            {this.props.icon}
                        </span>) : null
                }
                {
                    <input type={this.props.type} checked={this.props.visible} onChange={this.props.onCheckClicked} /> //FIXME - add onChecked
                }
                <span className="title">
                    {this.props.title || 'placeholder'}
                </span>
            </li >
        )
    }
}

export default TreeLeaf;