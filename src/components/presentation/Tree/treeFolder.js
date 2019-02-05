import React from "react";
import Icon from "../../presentation/atoms/Icon"
import PropTypes from "prop-types";
import './tree.css';
import classnames from 'classnames';
class TreeFolder extends React.PureComponent {
    constructor() {
        super();
    }

    // props.icon
    // props.checkable
    // props.checked
    // props.title
    // props.onCheckClick 

    // collapsed
    // onCollapsedClick
    // expanded
    render() {
        const folderClasses = classnames('folder', {
            expanded: this.props.expanded,
        });

        return (
            <li className = {folderClasses}>
                <div onClick={this.props.onClickExpand} className="ptr-icon-baseline ptr-icon-inline-wrap">
                    {
                        this.props.expanded ? <Icon icon={'minus'} width={18} height={18} viewBox={'0 0 34 34'} className={'ptr-inline-icon hover'} /> : <Icon icon={'plus'} width={18} height={18} viewBox={'0 0 34 34'} className={'ptr-inline-icon hover'}/>
                    }
                </div>
                {/* {
                    this.props.icon ? (
                        <span class="rc-tree-switcher rc-tree-switcher-noop">
                            {this.props.icon}
                        </span>) : null
                }
                {
                    this.props.checkable ? (
                        <input type="checkbox" checked={this.props.checked}/> //FIXME - add onChecked
                    ) : null
                } */}
                <span className="title">
                    {this.props.title}
                </span>
                {
                    this.props.expanded && React.Children.count(this.props.children) > 0 ? (
                        <ul className={'gs-tree'}>
                            {this.props.children}
                        </ul>
                    ) : null
                }
            </li >
        )
    }
}


TreeFolder.defaultProps = {
    expanded: false,
    onClickExpand: () => {},
}

TreeFolder.propTypes = {
    expanded: PropTypes.bool,
    onClickExpand: PropTypes.func,
}

export default TreeFolder;