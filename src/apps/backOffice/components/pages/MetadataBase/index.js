import React from 'react';
import {withNamespaces} from "react-i18next";
import {Route, Switch} from "react-router";
import LayerTemplatesList from "../../lists/LayerTemplatesList";
import NavList from 'components/presentation/NavList'

import './metadataBase.scss';

class MetadataBase extends React.PureComponent {
	constructor(props) {
		super(props);

		this.paths = {
			layerTemplates: `${this.props.match.path}/layerTemplates`,
			scopes: `${this.props.match.path}/scopes`,
		}

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
		
		return (
			<div className="ptr-base-page">
				<div className="ptr-bo-metadata-base-menu">
					<NavList items={this.navList} location={location}/>
				</div>
				<div className="ptr-bo-metadata-base-list">
					<Switch>
						<Route path={this.paths.layerTemplates} component={LayerTemplatesList} />
						<Route path={this.paths.scopes} render={() => (<div>Scopes</div>)} />
					</Switch>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(MetadataBase);