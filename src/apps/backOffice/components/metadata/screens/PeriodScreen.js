import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from '@gisatcz/ptr-locales';

import PeriodConfig from "../configs/PeriodConfig";
import PeriodSwitcher from "../switchers/PeriodSwitcher";

import "../../screens/style.scss";

class PeriodScreen extends React.PureComponent {
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
						{t('metadata.names.period')}
					</div>
					<div className="ptr-bo-screen-switcher">
						<PeriodSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-bo-screen-content">
					<PeriodConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(PeriodScreen);