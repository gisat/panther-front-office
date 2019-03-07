import React from 'react';
import PropTypes from "prop-types";
import LayerTemplateMetadataConfig from "../../metadataConfigs/LayerTemplateMetadataConfig";
import LayerTemplateMetadataSwitcher from "../../metadataSwitchers/LayerTemplateMetadataSwitcher";

import "../style.scss";

class LayerTemplateMetadataScreen extends React.PureComponent {
	static propTypes = {
		itemKey: PropTypes.string
	};

	render() {
		return (
			<div className='ptr-bo-colours'>
				<div className="ptr-screen-content ptr-screen-metadata-header">
					<div className="ptr-screen-metadata-title">
						Layer templates
					</div>
					<div className="ptr-screen-metadata-switcher">
						<LayerTemplateMetadataSwitcher
							itemKey={this.props.itemKey}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-screen-metadata-content">
					<LayerTemplateMetadataConfig
						itemKey={this.props.itemKey}
					/>
				</div>
			</div>
		);
	}
}

export default LayerTemplateMetadataScreen;