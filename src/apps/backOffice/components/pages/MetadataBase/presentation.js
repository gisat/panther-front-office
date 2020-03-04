import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from '@gisatcz/ptr-locales';
import {Route, Switch, connects} from '@gisatcz/ptr-state';
import Helmet from "react-helmet";

/* Base types */
import AttributesList from "../../lists/AttributesList";
import CasesList from "../../lists/CasesList";
import LayerTemplatesList from "../../lists/LayerTemplatesList";
import PeriodsList from "../../lists/PeriodsList";
import PlacesList from "../../lists/PlacesList";
import TagsList from "../../lists/TagsList";
import ViewsList from "../../lists/ViewsList";

/* Specific types */
import EsponFuoreIndicatorsList from "../../lists/EsponFuoreIndicatorsList";
import './style.scss';
const NavList = connects.NavList;

class MetadataBase extends React.PureComponent {
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
				<Helmet><title>Metadata</title></Helmet>
				<div className="ptr-bo-page-base-menu">
					<NavList
						componentKey="NavList_BackOfficeMetadataBase"
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
			{key: 'attributes', title: t('metadata.names.attribute_plural'), component: AttributesList},
			{key: 'cases', title: t('metadata.names.case_plural'), component: CasesList},
			{key: 'layerTemplates', title: t('metadata.names.layerTemplate_plural'), component: LayerTemplatesList},
			{key: 'periods', title: t('metadata.names.period_plural'), component: PeriodsList},
			{key: 'places', title: t('metadata.names.place_plural'), component: PlacesList},
			{key: 'tags', title: t('metadata.names.tag_plural'), component: TagsList},
			{key: 'views', title: t('metadata.names.view_plural'), component: ViewsList},
		];

		let spacificDataTypes = [];
		if (this.props.specificDataTypes) {
			this.props.specificDataTypes.forEach(type => {
				if (type === 'esponFuoreIndicators') {
					spacificDataTypes.push({key: 'esponFuoreIndicators', title: t('metadata.names.esponFuoreIndicator_plural'), component: EsponFuoreIndicatorsList})
				}
			});
		}

		return [...baseDataTypes, ...spacificDataTypes];
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

export default withNamespaces(['backOffice'])(MetadataBase);