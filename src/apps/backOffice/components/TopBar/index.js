import React from 'react';
import {NavLink, connects} from '@gisatcz/ptr-state';
import {Icon} from '@gisatcz/ptr-atoms';
import {User} from '@gisatcz/ptr-components';

import Apps from './icons/Apps';
import Dashboard from './icons/Dashboard';
import Places from "./icons/Places";
import SpatialDataSources from './icons/SpatialDataSources';
import AttributeDataSources from './icons/AttributeDataSources';
import Metadata from './icons/Metadata';
import Users from './icons/Users';
import AppSelect from '../AppSelect';

import './style.scss';

const ConnectedUser = connects.User(User);

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
					<AppSelect managedAppKey={this.props.managedAppKey}/>
				</div>
				<div className="ptr-bo-top-bar-quick-access">
					<NavLink
						exact
						to={this.props.appPath + '/'}
						onKeyPress={this.onNavKeyPress.bind(this, '/')}
					>
						<Icon icon={Dashboard}/>
					</NavLink>
					<NavLink
						to={this.props.appPath + '/apps'}
						onKeyPress={this.onNavKeyPress.bind(this, '/apps')}
					>
						<Icon icon={Apps}/>
					</NavLink>
					<NavLink
						to={this.props.appPath + '/places'}
						onKeyPress={this.onNavKeyPress.bind(this, '/places')}
					>
						<Icon icon={Places}/>
					</NavLink>
					<NavLink
						to={this.props.appPath + '/spatialDataSources'}
						onKeyPress={this.onNavKeyPress.bind(this, '/spatialDataSources')}
					>
						<Icon icon={SpatialDataSources}/>
					</NavLink>
					<NavLink
						to={this.props.appPath + '/attributeDataSources'}
						onKeyPress={this.onNavKeyPress.bind(this, '/attributeDataSources')}
					>
						<Icon icon={AttributeDataSources}/>
					</NavLink>
					<NavLink
						to={this.props.appPath + '/metadata'}
						onKeyPress={this.onNavKeyPress.bind(this, '/metadata')}
					>
						<Icon icon={Metadata}/>
					</NavLink>
					<NavLink
						to={this.props.appPath + '/users'}
						onKeyPress={this.onNavKeyPress.bind(this, '/users')}
					>
						<Icon icon={Users}/>
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
					<ConnectedUser/>
				</div>
			</>
		)
	}
}

export default TopBar;
