import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import LayerTreesAppsConfig from "../configs/LayerTreesAppsConfig";
import LayerTreesAppsSwitcher from "../switchers/LayerTreesAppsSwitcher";

import "../../screens/style.scss";

class LayerTreesAppsScreen extends React.PureComponent {
	static propTypes = {
		itemKey: PropTypes.string,
		unfocusable: PropTypes.bool,
	};

	render() {
		const t = this.props.t;

		return (
			<div className='ptr-bo-colours'>
				<div className="ptr-screen-content ptr-bo-screen-header">
					<div className="ptr-bo-screen-title">
						{t('apps.names.layerTrees')}
					</div>
					<div className="ptr-bo-screen-switcher">
						<LayerTreesAppsSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-bo-screen-content">
					<LayerTreesAppsConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(LayerTreesAppsScreen);