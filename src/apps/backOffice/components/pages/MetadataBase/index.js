import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from "react-i18next";
import {Route, Switch} from "react-router";
import Helmet from "react-helmet";

import LayerTemplatesList from "../../lists/LayerTemplatesList";
import ScopesList from "../../lists/ScopesList";
import NavList from '../../../../../components/presentation/NavList'

import './metadataBase.scss';

class MetadataBase extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.paths = {
			layerTemplates: `${this.props.match.path}/layerTemplates`,
			scopes: `${this.props.match.path}/scopes`,
		};

		this.navList = [
			{
				title: 'Base',
				type: 'folder',
				items: [
					{
						type: 'leaf',
						title: 'Layer Templates',
						path: this.paths.layerTemplates
					},
					{
						type: 'leaf',
						title: 'Scopes',
						path: this.paths.scopes
					}
				]
			}
		]
	}
	render() {
		const location = this.props.match.path;
		let props = {unfocusable: this.props.unfocusable};
		
		return (
			<div className="ptr-base-page ptr-bo-metadata-base">
				<Helmet><title>Metadata</title></Helmet>
				<div className="ptr-bo-metadata-base-menu">
					<NavList items={this.navList} location={location} unfocusable={this.props.unfocusable}/>
				</div>
				<div className="ptr-bo-metadata-base-list">
					<Switch>
						<Route path={this.paths.layerTemplates} render={() => React.createElement(LayerTemplatesList, props)} />
						<Route path={this.paths.scopes} render={() => React.createElement(ScopesList, props)} />
					</Switch>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(MetadataBase);