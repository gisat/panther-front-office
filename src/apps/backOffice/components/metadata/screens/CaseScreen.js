import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from '@gisatcz/ptr-locales';

import CaseConfig from "../configs/CaseConfig";
import CaseSwitcher from "../switchers/CaseSwitcher";

import "../../screens/style.scss";

class CaseScreen extends React.PureComponent {
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
						{t('metadata.names.case')}
					</div>
					<div className="ptr-bo-screen-switcher">
						<CaseSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-bo-screen-content">
					<CaseConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(CaseScreen);