import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import ViewMetadataConfig from "../configs/ViewMetadataConfig";
import ViewMetadataSwitcher from "../switchers/ViewMetadataSwitcher";

import "../../screens/style.scss";

class ViewMetadataScreen extends React.PureComponent {
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
						{t('metadata.names.view')}
					</div>
					<div className="ptr-bo-screen-switcher">
						<ViewMetadataSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-bo-screen-content">
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