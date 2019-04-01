import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import ViewMetadataConfig from "../configs/ViewMetadataConfig";
import ViewMetadataSwitcher from "../switchers/ViewMetadataSwitcher";

import "./style.scss";

class ViewMetadataScreen extends React.PureComponent {
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
						{t('metadata.names.view')}
					</div>
					<div className="ptr-screen-metadata-switcher">
						<ViewMetadataSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-screen-metadata-content">
					<ViewMetadataConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(ViewMetadataScreen);