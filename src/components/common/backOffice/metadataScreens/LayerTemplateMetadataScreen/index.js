import React from 'react';
import PropTypes from "prop-types";
import LayerTemplateMetadataConfig from "../../metadataConfigs/LayerTemplateMetadataConfig";
import LayerTemplateMetadataSwitcher from "../../metadataSwitchers/LayerTemplateMetadataSwitcher";

class LayerTemplateMetadataScreen extends React.PureComponent {
	static propTypes = {
		itemKey: PropTypes.string
	};

	render() {
		return (
			<div className='ptr-bo-colours margin-1'>
				<h1>
					Layer templates
				</h1>
				<div className="ptr-screen-metadata-switcher">
					<LayerTemplateMetadataSwitcher
						itemKey={this.props.itemKey}
					/>
				</div>
				<div className="ptr-screen-metadata-content">
					<LayerTemplateMetadataConfig
						itemKey={this.props.itemKey}
					/>
				</div>
			</div>
		);
	}
}

export default LayerTemplateMetadataScreen;