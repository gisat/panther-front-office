import React from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from '@gisatcz/ptr-locales';

import LayerTreesConfig from "../configs/LayerTreesConfig";
import LayerTreesSwitcher from "../switchers/LayerTreesSwitcher";

import "../../screens/style.scss";

class LayerTreesScreen extends React.PureComponent {
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
						<LayerTreesSwitcher
							itemKey={this.props.itemKey}
							unfocusable={this.props.unfocusable}
						/>
					</div>
				</div>
				<div className="ptr-screen-content ptr-bo-screen-content">
					<LayerTreesConfig
						itemKey={this.props.itemKey}
						unfocusable={this.props.unfocusable}
					/>
				</div>
			</div>
		);
	}
}

export default withNamespaces(['backOffice'])(LayerTreesScreen);