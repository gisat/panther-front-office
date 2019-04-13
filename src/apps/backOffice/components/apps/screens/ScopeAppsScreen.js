import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import ScopeAppsConfig from "../configs/ScopeAppsConfig";
import ScopeAppsSwitcher from "../switchers/ScopeAppsSwitcher";

import "../../screens/style.scss";

class ScopeAppsScreen extends React.PureComponent {
	static propTypes = {
		itemKey: PropTypes.string,
		unfocusable: PropTypes.bool,
	};

	render() {
		const t = this.props.t;

		return (
			<div className='ptr-bo-colours'>
				<div className="ptr-screen-content ptr-bo-screen-header">
					<div className="ptr-bo-screen-title">
						{t('apps.names.scope')}
					</div>
					<div className="ptr-bo-screen-switcher">
						<ScopeAppsSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-bo-screen-content">
					<ScopeAppsConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(ScopeAppsScreen);