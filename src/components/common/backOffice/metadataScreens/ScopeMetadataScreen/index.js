import React from 'react';
import PropTypes from "prop-types";
import ScopeMetadataConfig from "../../metadataConfigs/ScopeMetadataConfig";
import ScopeMetadataSwitcher from "../../metadataSwitchers/ScopesMetadataSwitcher";

import "../style.scss";

class ScopeMetadataScreen extends React.PureComponent {
	static propTypes = {
		itemKey: PropTypes.string
	};

	render() {
		return (
			<div className='ptr-bo-colours margin-1'>
				<h1>
					Scope
				</h1>
				<div className="ptr-screen-metadata-switcher">
					<ScopeMetadataSwitcher
						itemKey={this.props.itemKey}
					/>
				</div>
				<div className="ptr-screen-metadata-content">
					<ScopeMetadataConfig
						itemKey={this.props.itemKey}
					/>
				</div>
			</div>
		);
	}
}

export default ScopeMetadataScreen;