import React from 'react';
import PropTypes from "prop-types";
import ScopeMetadataConfig from "../../metadataConfigs/ScopeMetadataConfig";
import ScopeMetadataSwitcher from "../../metadataSwitchers/ScopesMetadataSwitcher";

import "../style.scss";

class ScopeMetadataScreen extends React.PureComponent {
	static propTypes = {
		itemKey: PropTypes.string,
		unfocusable: PropTypes.bool,
	};

	render() {
		return (
			<div className='ptr-bo-colours'>
				<div className="ptr-screen-content ptr-screen-metadata-header">
					<div className="ptr-screen-metadata-title">
						Scope
					</div>
					<div className="ptr-screen-metadata-switcher">
						<ScopeMetadataSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-screen-metadata-content">
					<ScopeMetadataConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default ScopeMetadataScreen;