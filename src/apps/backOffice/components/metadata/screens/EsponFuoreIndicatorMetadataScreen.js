import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import IndicatorMetadataConfig from "../configs/EsponFuoreIndicatorMetadataConfig";
import IndicatorMetadataSwitcher from "../switchers/EsponFuoreIndicatorMetadataSwitcher";

import "../../screens/style.scss";

class EsponFuoreIndicatorMetadataScreen extends React.PureComponent {
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
						<IndicatorMetadataSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-bo-screen-content">
					<IndicatorMetadataConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(EsponFuoreIndicatorMetadataScreen);