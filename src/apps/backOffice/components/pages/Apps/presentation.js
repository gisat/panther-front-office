import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from '@gisatcz/ptr-locales';
import {Route, Switch} from "react-router";
import Helmet from "react-helmet";

/* Base types */
import ScopesList from "../../lists/ScopesList";
import ConfigurationsList from "../../lists/ConfigurationsList";
import LayerTreesList from "../../lists/LayerTreesList";

/* Specific types */


import NavList from '../../../../../components/presentation/NavList'

import './style.scss';

class Apps extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool,
		specificDataTypes: PropTypes.array
	};

	constructor(props) {
		super(props);
	}

	render() {
		let dataTypes = this.getDataTypes();
		let paths = this.getPathsForDataTypes(dataTypes);
		let navList = this.getNavigation(dataTypes, paths);


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
						{dataTypes.map(item => {
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

	getDataTypes() {
		const t = this.props.t;

		let baseDataTypes = [
			{key: 'scopes', title: t('apps.names.scope_plural'), component: ScopesList},
			{key: 'configurations', title: t('apps.names.configuration_plural'), component: ConfigurationsList},
			{key: 'layerTrees', title: t('apps.names.layerTrees'), component: LayerTreesList},
		];

		let specificDataTypes = [];
		if (this.props.specificDataTypes) {
			this.props.specificDataTypes.forEach(type => {
			});
		}

		return [...baseDataTypes, ...specificDataTypes];
	}

	getPathsForDataTypes(dataTypes) {
		let paths = {};
		dataTypes.forEach(item => {
			paths[item.key] = `${this.props.match.path}/${item.key}`;
		});

		return paths;
	}

	getNavigation(dataTypes, paths) {
		return dataTypes.map(item => {
			return {
				type: 'leaf',
				title: item.title,
				path: paths[item.key]
			}
		})
	}
}

export default withNamespaces(['backOffice'])(Apps);