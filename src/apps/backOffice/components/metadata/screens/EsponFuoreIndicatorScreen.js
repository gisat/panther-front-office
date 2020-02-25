import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from '@gisatcz/ptr-locales';

import IndicatorConfig from "../configs/EsponFuoreIndicatorConfig";
import IndicatorSwitcher from "../switchers/EsponFuoreIndicatorSwitcher";

import "../../screens/style.scss";

class EsponFuoreIndicatorScreen extends React.PureComponent {
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
						{t('metadata.names.esponFuoreIndicator')}
					</div>
					<div className="ptr-bo-screen-switcher">
						<IndicatorSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-bo-screen-content">
					<IndicatorConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(EsponFuoreIndicatorScreen);