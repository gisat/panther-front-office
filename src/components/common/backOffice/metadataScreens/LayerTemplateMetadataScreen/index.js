import React from 'react';
import PropTypes from "prop-types";
import LayerTemplateMetadataConfig from "../../metadataConfigs/LayerTemplateMetadataConfig";
import LayerTemplateMetadataSwitcher from "../../metadataSwitchers/LayerTemplateMetadataSwitcher";

class LayerTemplateMetadataScreen extends React.PureComponent {
	static propTypes = {
		layerTemplateKey: PropTypes.string
	};

	render() {
		return (
			<div className='ptr-bo-colours'>
				<div className="ptr-screen-metadata-switcher">
					<LayerTemplateMetadataSwitcher
						layerTemplateKey={this.props.layerTemplateKey}
					/>
				</div>
				<div className="ptr-screen-metadata-content">
					<LayerTemplateMetadataConfig
						layerTemplateKey={this.props.layerTemplateKey}
					/>
				</div>
			</div>
		);
	}
}

export default LayerTemplateMetadataScreen;