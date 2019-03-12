import React from 'react';
import PropTypes from "prop-types";
import LayerTemplateMetadataConfig from "../../metadataConfigs/LayerTemplateMetadataConfig";
import LayerTemplateMetadataSwitcher from "../../metadataSwitchers/LayerTemplateMetadataSwitcher";

import "../style.scss";

class LayerTemplateMetadataScreen extends React.PureComponent {
	static propTypes = {
		itemKey: PropTypes.string,
		unfocusable: PropTypes.bool
	};

	render() {
		return (
			<div className='ptr-bo-colours'>
				<div className="ptr-screen-content ptr-screen-metadata-header">
					<div className="ptr-screen-metadata-title">
						Layer template
					</div>
					<div className="ptr-screen-metadata-switcher">
						<LayerTemplateMetadataSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-screen-metadata-content">
					<LayerTemplateMetadataConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default LayerTemplateMetadataScreen;