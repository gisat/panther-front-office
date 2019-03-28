import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import AttributeMetadataConfig from "../configs/AttributeMetadataConfig";
import AttributeMetadataSwitcher from "../switchers/AttributeMetadataSwitcher";

import "./style.scss";

class AttributeMetadataScreen extends React.PureComponent {
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
						{t('metadata.names.attribute')}
					</div>
					<div className="ptr-screen-metadata-switcher">
						<AttributeMetadataSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-screen-metadata-content">
					<AttributeMetadataConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(AttributeMetadataScreen);