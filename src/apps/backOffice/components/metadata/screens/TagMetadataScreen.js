import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import TagMetadataConfig from "../configs/TagMetadataConfig";
import TagMetadataSwitcher from "../switchers/TagMetadataSwitcher";

import "../../screens/style.scss";

class TagMetadataScreen extends React.PureComponent {
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
						{t('metadata.names.tag')}
					</div>
					<div className="ptr-bo-screen-switcher">
						<TagMetadataSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-bo-screen-content">
					<TagMetadataConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(TagMetadataScreen);