import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import LayerTemplateMetadataConfig from "../configs/LayerTemplateMetadataConfig";
import LayerTemplateMetadataSwitcher from "../switchers/LayerTemplateMetadataSwitcher";

import "./style.scss";

class LayerTemplateMetadataScreen extends React.PureComponent {
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
						{t('metadata.names.layerTemplate')}
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

export default withNamespaces(['backOffice'])(LayerTemplateMetadataScreen);