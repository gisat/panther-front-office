import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from "react-i18next";
import {Route, Switch} from "react-router";
import Helmet from "react-helmet";

import utils from '../../../../../utils/sort';

/* Base types */
import AttributesList from "../../lists/AttributesList";
import LayerTemplatesList from "../../lists/LayerTemplatesList";
import PeriodsList from "../../lists/PeriodsList";
import PlacesList from "../../lists/PlacesList";
import ScopesList from "../../lists/ScopesList";
import TagsList from "../../lists/TagsList";
import ViewsList from "../../lists/ViewsList";

/* Specific types */
import EsponFuoreIndicatorsList from "../../lists/EsponFuoreIndicatorsList";

import NavList from '../../../../../components/presentation/NavList'

import './metadataBase.scss';

class MetadataBase extends React.PureComponent {
	static propTypes = {
		unfocusable: PropTypes.bool,
		specificTypes: PropTypes.array
	};

	constructor(props) {
		super(props);
	}

	render() {
		let metadata = this.getMetadata();
		let paths = this.getPathsForMetadata(metadata);
		let navList = this.getNavigation(metadata, paths);


		const location = this.props.match.path;
		let props = {unfocusable: this.props.unfocusable};

		return (
			<div className="ptr-base-page ptr-bo-metadata-base">
				<Helmet><title>Metadata</title></Helmet>
				<div className="ptr-bo-metadata-base-menu">
					<NavList
						componentKey="NavList_BackOfficeMetadataBase"
						items={navList}
						location={location}
						unfocusable={this.props.unfocusable}/>
				</div>
				<div className="ptr-bo-metadata-base-list">
					<Switch>
						{metadata.map(item => {
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

	getMetadata() {
		const t = this.props.t;

		let baseMetatadata = [
			{key: 'attributes', title: t('metadata.names.attribute_plural'), component: AttributesList},
			{key: 'layerTemplates', title: t('metadata.names.layerTemplate_plural'), component: LayerTemplatesList},
			{key: 'periods', title: t('metadata.names.period_plural'), component: PeriodsList},
			{key: 'places', title: t('metadata.names.place_plural'), component: PlacesList},
			{key: 'scopes', title: t('metadata.names.scope_plural'), component: ScopesList},
			{key: 'tags', title: t('metadata.names.tag_plural'), component: TagsList},
			{key: 'views', title: t('metadata.names.view_plural'), component: ViewsList},
		];

		let specificMetadata = [];
		if (this.props.specificTypes) {
			this.props.specificTypes.forEach(type => {
				if (type === 'esponFuoreIndicators') {
					specificMetadata.push({key: 'esponFuoreIndicators', title: t('metadata.names.esponFuoreIndicator_plural'), component: EsponFuoreIndicatorsList})
				}
			});
		}

		return [...baseMetatadata, ...specificMetadata];
	}

	getPathsForMetadata(metadata) {
		let paths = {};
		metadata.forEach(item => {
			paths[item.key] = `${this.props.match.path}/${item.key}`;
		});

		return paths;
	}

	getNavigation(metadata, paths) {
		return metadata.map(item => {
			return {
				type: 'leaf',
				title: item.title,
				path: paths[item.key]
			}
		})
	}
}

export default withNamespaces(['backOffice'])(MetadataBase);