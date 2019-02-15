import React from 'react';
import {withNamespaces} from "react-i18next";
import { NavLink } from 'react-router-dom'
import {Route, Switch} from "react-router";

class MetadataBase extends React.PureComponent {
	render() {
		return (
			<div className="ptr-bo-metadata-base">
				<div className="ptr-bo-metadata-base-menu">
					<NavLink
						to={this.props.match.path + "/layerTemplates"}
						activeClassName="selected"
					>
						Layer Templates
					</NavLink>
					<NavLink
						to={this.props.match.path + "/scopes"}
						activeClassName="selected"
					>
						Scopes
					</NavLink>
				</div>
				<div className="ptr-bo-metadata-base-list">
					<Switch>
						<Route path={this.props.match.path  + "/layerTemplates"} render={() => (<div>Layer Templates</div>)} />
						<Route path={this.props.match.path  + "/scopes"} render={() => (<div>Scopes</div>)} />
					</Switch>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(MetadataBase);