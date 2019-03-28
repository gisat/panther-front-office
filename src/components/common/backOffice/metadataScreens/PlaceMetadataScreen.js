import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import PlaceMetadataConfig from "../metadataConfigs/PlaceMetadataConfig";
import PlaceMetadataSwitcher from "../metadataSwitchers/PlaceMetadataSwitcher";

import "./style.scss";

class PlaceMetadataScreen extends React.PureComponent {
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
						{t('metadata.names.place')}
					</div>
					<div className="ptr-screen-metadata-switcher">
						<PlaceMetadataSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-screen-metadata-content">
					<PlaceMetadataConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(PlaceMetadataScreen);