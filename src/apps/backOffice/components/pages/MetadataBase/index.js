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
		const t = props.t;

		this.metadata = [
			{key: 'attributes', title: t('metadata.names.attribute_plural'), component: AttributesList},
			{key: 'layerTemplates', title: t('metadata.names.layerTemplate_plural'), component: LayerTemplatesList},
			{key: 'periods', title: t('metadata.names.period_plural'), component: PeriodsList},
			{key: 'places', title: t('metadata.names.place_plural'), component: PlacesList},
			{key: 'scopes', title: t('metadata.names.scope_plural'), component: ScopesList},
			{key: 'tags', title: t('metadata.names.tag_plural'), component: TagsList},
		];

		this.paths = {};
		this.metadata.forEach(item => {
			this.paths[item.key] = `${this.props.match.path}/${item.key}`;
		});

		this.navList = [
			{
				title: 'Base',
				type: 'folder',
				items: this.metadata.map(item => {
					return {
						type: 'leaf',
						title: item.title,
						path: this.paths[item.key]
					}
				})
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
						{this.metadata.map(item => {
							return (
								<Route
									path={this.paths[item.key]}
									render={() => React.createElement(item.component, props)}
								/>);
						})}
					</Switch>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(MetadataBase);