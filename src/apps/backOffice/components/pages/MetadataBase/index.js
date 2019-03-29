import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from "react-i18next";
import {Route, Switch} from "react-router";
import Helmet from "react-helmet";

import AttributesList from "../../lists/AttributesList";
import LayerTemplatesList from "../../lists/LayerTemplatesList";
import PeriodsList from "../../lists/PeriodsList";
import PlacesList from "../../lists/PlacesList";
import ScopesList from "../../lists/ScopesList";
import TagsList from "../../lists/TagsList";

import NavList from '../../../../../components/presentation/NavList'

import './metadataBase.scss';

class MetadataBase extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.paths = {
			attributes: `${this.props.match.path}/attributes`,
			layerTemplates: `${this.props.match.path}/layerTemplates`,
			periods: `${this.props.match.path}/periods`,
			places: `${this.props.match.path}/places`,
			scopes: `${this.props.match.path}/scopes`,
			tags: `${this.props.match.path}/tags`,
		};

		this.navList = [
			{
				title: 'Base',
				type: 'folder',
				items: [
					{
						type: 'leaf',
						title: 'Attributes',
						path: this.paths.attributes
					},
					{
						type: 'leaf',
						title: 'Layer Templates',
						path: this.paths.layerTemplates
					},
					{
						type: 'leaf',
						title: 'Periods',
						path: this.paths.periods
					},
					{
						type: 'leaf',
						title: 'Places',
						path: this.paths.places
					},
					{
						type: 'leaf',
						title: 'Scopes',
						path: this.paths.scopes
					},
					{
						type: 'leaf',
						title: 'Tags',
						path: this.paths.tags
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
					<NavList
						componentKey="NavList_BackOfficeMetadataBase"
						items={this.navList}
						location={location}
						unfocusable={this.props.unfocusable}/>
				</div>
				<div className="ptr-bo-metadata-base-list">
					<Switch>
						<Route path={this.paths.attributes} render={() => React.createElement(AttributesList, props)} />
						<Route path={this.paths.layerTemplates} render={() => React.createElement(LayerTemplatesList, props)} />
						<Route path={this.paths.periods} render={() => React.createElement(PeriodsList, props)} />
						<Route path={this.paths.places} render={() => React.createElement(PlacesList, props)} />
						<Route path={this.paths.scopes} render={() => React.createElement(ScopesList, props)} />
						<Route path={this.paths.tags} render={() => React.createElement(TagsList, props)} />
					</Switch>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(MetadataBase);