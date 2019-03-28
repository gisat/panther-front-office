import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import PeriodMetadataConfig from "../metadataConfigs/PeriodMetadataConfig";
import PeriodMetadataSwitcher from "../metadataSwitchers/PeriodMetadataSwitcher";

import "./style.scss";

class PeriodMetadataScreen extends React.PureComponent {
	static propTypes = {
		itemKey: PropTypes.string,
		unfocusable: PropTypes.bool
	};

	render() {
		const t = this.props.t;

		return (
			<div className='ptr-bo-colours'>
				<div className="ptr-screen-content ptr-screen-metadata-header">
					<div className="ptr-screen-metadata-title">
						{t('metadata.names.period')}
					</div>
					<div className="ptr-screen-metadata-switcher">
						<PeriodMetadataSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-screen-metadata-content">
					<PeriodMetadataConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(PeriodMetadataScreen);