import React from "react";
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom'
import { matchPath } from 'react-router';

import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

import './navlist.scss';


class NavList extends React.PureComponent {
    static propTypes = {
        unfocusable: PropTypes.bool
    };

    onNavKeyPress(path, key) {
        if (key.charCode === 32) {
            this.props.history.replace(path);
        }
    }

    getDescendant (descendant) {
        switch (descendant.type) {
            case 'folder':
                return ([
                    <li key={descendant.title} className={'ptr-nav-item-folder'}>
                        {descendant.title}
                    </li>,
                    <ul key={`${descendant.title}-folder`}>
                        {this.getDescendants(descendant.items, descendant)}
                    </ul>
                    ]);
            case 'leaf':
                const isLeafActive = !!matchPath(
                    this.props.location.pathname, 
                    descendant.path
                    ); 
               return <li 
                        key={descendant.title}
                        className={`ptr-nav-item ${isLeafActive ? 'selected' : ''}`}>
                        <NavLink
                            tabIndex={this.props.unfocusable ? -1 : 0}
                            onKeyPress={this.onNavKeyPress.bind(this, descendant.path)}
                            to={descendant.path}
                            activeClassName="selected"
                            >
                            {descendant.title}
                        </NavLink>
                    </li>
        }
    }
    getDescendants(structure, parentProps) {
        if(isArray(structure)) {
            return structure.map((item) => this.getDescendant(item));
        }

        if(isObject(structure)) {
            return [this.getDescendant(structure)];
        }
    }

    render () {
        return (
                <div className={'ptr-navlist ptr-screen-scroll'}>
                    <ul>
                        {this.getDescendants(this.props.items)}
                    </ul>
                </div>
        )
    }
}


NavList.defaultProps = {
    items: [],
  };
  
  NavList.propTypes = {
    items: PropTypes.array.isRequired,
};

export default withRouter(NavList);