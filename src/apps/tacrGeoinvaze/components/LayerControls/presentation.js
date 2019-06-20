import React from "react";

import './style.scss';

class LayerControls extends React.PureComponent {

	render() {
		const props = this.props;

		if (props.isCrayfish) {
			return (
				<div className="tacrGeoinvaze-layer-controls">
					<div className="tacrGeoinvaze-actual-expansion">
						<span>Mapa VÚV TGM</span>
					</div>
				</div>
			);
		} else {
			return (
				<div className="tacrGeoinvaze-layer-controls">
					<div className="tacrGeoinvaze-actual-expansion">
						<span>Skutečné rozšíření</span>
						<div>(timeline)</div>
					</div>
					<div className="tacrGeoinvaze-model-gis">
						<span>GIS model</span>
						<div>(rok, dva, tři)</div>
					</div>
					<div className="tacrGeoinvaze-model-biomod">
						<span>BIOMOD model</span>
						<div>(varianty)</div>
					</div>
				</div>
			);
		}
	}
}


export default LayerControls;