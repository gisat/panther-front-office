import React from "react";
import PropTypes from 'prop-types';
import { NavLink, withRouter } from '@gisatcz/ptr-state'
import { matchPath } from '@gisatcz/ptr-state';

import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

import './navlist.scss';


class NavList extends React.PureComponent {
	static defaultProps = {
		items: []
	};

	static propTypes = {
		items: PropTypes.array.isRequired,
		unfocusable: PropTypes.bool
	};

	onNavKeyPress(path, key) {
		if (key.charCode === 32) {
			this.props.history.replace(path);
		}
	}

	componentDidMount() {
		if (this.props.componentData && this.props.componentData.lastPathname) {
			this.props.history.replace(this.props.componentData.lastPathname);
		} else if (this.props.location && this.props.location.pathname) {
			this.props.update({
				lastPathname: this.props.location.pathname
			});
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.location && this.props.location && prevProps.location.pathname !== this.props.location.pathname) {
			this.props.update({
				lastPathname: this.props.location.pathname
			});
		}
	}

	getDescendant (descendant) {
		switch (descendant.type) {
			case 'folder':
				return ([
					<li key={descendant.title} className={'ptr-nav-item-folder'}>
						<span>{descendant.title}</span>
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
			<div className={'ptr-navlist'}>
				<ul ref={this.list}>
					{this.getDescendants(this.props.items)}
				</ul>
			</div>
		)
	}
}

export default withRouter(NavList);