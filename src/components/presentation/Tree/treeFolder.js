import React from "react";
import Icon from "../../presentation/atoms/Icon"
import PropTypes from "prop-types";
import './tree.css';
import classnames from 'classnames';
class TreeFolder extends React.PureComponent {
    render() {
        const folderClasses = classnames('folder', {
            expanded: this.props.expanded,
        });

        return (
            <li className = {folderClasses}>
                <span onClick={(evt) => {evt.preventDefault();this.props.onClickExpand()}} className={'hover'}>
                    <div className="ptr-icon-baseline ptr-icon-inline-wrap">
                        {
                            this.props.expanded ? <Icon icon={'minus'} width={18} height={18} viewBox={'0 0 34 34'} className={'ptr-inline-icon hover'} /> : <Icon icon={'plus'} width={18} height={18} viewBox={'0 0 34 34'} className={'ptr-inline-icon hover'}/>
                        }
                    </div>
                    {/* {
                        this.props.icon ? (
                            <span class="rc-tree-switcher rc-tree-switcher-noop">
                                {this.props.icon}
                            </span>) : null
                    } */}
                    <span className="title">
                        {this.props.title}
                    </span>
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
    children: [],
    title: '',
}

TreeFolder.propTypes = {
    expanded: PropTypes.bool,
    onClickExpand: PropTypes.func,
    children: PropTypes.arrayOf(PropTypes.element),
    title: PropTypes.string,
    // icon: PropTypes.element
}

export default TreeFolder;