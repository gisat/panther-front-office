import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from "react-i18next";
import {Route, Switch} from "react-router";
import Helmet from "react-helmet";

import utils from '../../../../../utils/sort';

/* Base types */
import ScopesList from "../../lists/ScopesList";

/* Specific types */


import NavList from '../../../../../components/presentation/NavList'

import './style.scss';

class Apps extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool,
		specificTypes: PropTypes.array
	};

	constructor(props) {
		super(props);
	}

	render() {
		let settings = this.getSettings();
		let paths = this.getPathsForSettings(settings);
		let navList = this.getNavigation(settings, paths);


		const location = this.props.match.path;
		let props = {unfocusable: this.props.unfocusable};

		return (
			<div className="ptr-base-page ptr-bo-page-base">
				<Helmet><title>Apps</title></Helmet>
				<div className="ptr-bo-page-base-menu">
					<NavList
						componentKey="NavList_BackOfficeApps"
						items={navList}
						location={location}
						unfocusable={this.props.unfocusable}/>
				</div>
				<div className="ptr-bo-page-base-list">
					<Switch>
						{settings.map(item => {
							return (
								<Route
									key={item.key}
									path={paths[item.key]}
									render={() => React.createElement(item.component, props)}
								/>);
						})}
					</Switch>
				</div>
			</div>
		);
	}

	getSettings() {
		const t = this.props.t;

		let baseSettings = [
			{key: 'scopes', title: t('apps.names.scope_plural'), component: ScopesList},
		];

		let specificSettings = [];
		if (this.props.specificTypes) {
			this.props.specificTypes.forEach(type => {
			});
		}

		return [...baseSettings, ...specificSettings];
	}

	getPathsForSettings(settings) {
		let paths = {};
		settings.forEach(item => {
			paths[item.key] = `${this.props.match.path}/${item.key}`;
		});

		return paths;
	}

	getNavigation(settings, paths) {
		return settings.map(item => {
			return {
				type: 'leaf',
				title: item.title,
				path: paths[item.key]
			}
		})
	}
}

export default withNamespaces(['backOffice'])(Apps);