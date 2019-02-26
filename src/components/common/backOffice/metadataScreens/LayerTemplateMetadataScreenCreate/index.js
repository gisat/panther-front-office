import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import LayerTemplateMetadataConfigCreate from "../../metadataConfigs/LayerTemplateMetadataConfigCreate";
import utils from "utils/utils";
class LayerTemplateMetadataScreenCreate extends React.PureComponent {

	render() {
		//is it possible?
		const layerTemplateKey = utils.uuid();

		const t = this.props.t;
		return (
			<div className='ptr-bo-colours margin-1'>
				<h1>
					{/* {t("nameCapitalized")} */}
					Create layer template
				</h1>
				<div className="ptr-screen-metadata-content">
					<LayerTemplateMetadataConfigCreate layerTemplateKey={layerTemplateKey}/>
				</div>
			</div>
		);
	}
}

export default withNamespaces()(LayerTemplateMetadataScreenCreate);