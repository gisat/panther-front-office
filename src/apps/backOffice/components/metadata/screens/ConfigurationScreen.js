import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from '@gisatcz/ptr-locales';

import ConfigurationConfig from "../configs/ConfigurationConfig";
import ConfigurationSwitcher from "../switchers/ConfigurationSwitcher";

import "../../screens/style.scss";

class ConfigurationScreen extends React.PureComponent {
	static propTypes = {
		itemKey: PropTypes.string,
		unfocusable: PropTypes.bool
	};

	render() {
		const t = this.props.t;

		return (
			<div className='ptr-bo-colours'>
				<div className="ptr-screen-content ptr-bo-screen-header">
					<div className="ptr-bo-screen-title">
						{t('apps.names.configuration')}
					</div>
					<div className="ptr-bo-screen-switcher">
						<ConfigurationSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-bo-screen-content">
					<ConfigurationConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(ConfigurationScreen);