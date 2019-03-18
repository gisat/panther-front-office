import React from 'react';
import classNames from 'classnames';
import {NavLink, withRouter} from 'react-router-dom';

import Icon from '../../../../components/common/atoms/Icon';
import Metadata from './icons/Metadata';
import AppSelect from '../AppSelect';

import './style.scss';
import PropTypes from "prop-types";
import {matchPath} from "react-router";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import User from "../../../../components/common/controls/User";

class TopBar extends React.PureComponent {
	onNavKeyPress(path, key) {
		if (key.charCode === 32) {
			this.props.history.replace(this.props.appPath + path);
		}
	}

	render () {
		return (
			<>
				<div className="ptr-bo-top-bar-app-select">
					<AppSelect />
				</div>
				<div className="ptr-bo-top-bar-quick-access">
					<NavLink
						exact
						to={this.props.appPath + '/'}
						onKeyPress={this.onNavKeyPress.bind(this, '/')}
					>
						<Icon />
					</NavLink>
					<NavLink
						to={this.props.appPath + '/metadata'}
						onKeyPress={this.onNavKeyPress.bind(this, '/metadata')}
					>
						<Icon icon={Metadata}/>
					</NavLink>
					<NavLink
						to={this.props.appPath + '/test'}
						onKeyPress={this.onNavKeyPress.bind(this, '/test')}
					>
						<Icon />
					</NavLink>
					<NavLink
						to={this.props.appPath + '/testselect'}
						onKeyPress={this.onNavKeyPress.bind(this, '/testselect')}
					>
						<Icon />
					</NavLink>
				</div>
				<div className="ptr-bo-top-bar-user">
					<User/>
				</div>
			</>
		)
	}
}

export default TopBar;
