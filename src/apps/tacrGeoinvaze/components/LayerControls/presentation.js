import React from "react";

import './style.scss';

class LayerControls extends React.PureComponent {

	render() {
		const props = this.props;
		
		let actualExpansionInsert = null;
		
		if (props.isCrayfish) {
			actualExpansionInsert = (
				<div className="tacrGeoinvaze-actual-expansion">
					<div className="tacrGeoinvaze-layer-title">Skutečné rozšíření</div>
					<div className="tacrGeoinvaze-layer-description">Mapa VÚV TGM</div>
				</div>
			);
		} else {
			actualExpansionInsert = (
				<div className="tacrGeoinvaze-actual-expansion">
					<div className="tacrGeoinvaze-layer-title">Skutečné rozšíření</div>
					<div>(timeline)</div>
				</div>
			);
		}

		return (
			<div className="tacrGeoinvaze-layer-controls">
				{actualExpansionInsert}
				<div className="tacrGeoinvaze-model-gis">
					<div className="tacrGeoinvaze-layer-title">Model budoucího rozšíření</div>
					<div>(rok, dva, tři)</div>
				</div>
				<div className="tacrGeoinvaze-model-biomod">
					<div className="tacrGeoinvaze-layer-title">Model pravděpodobnosti rozšíření</div>
					<div>(varianty)</div>
				</div>
			</div>
		);

	}
}


export default LayerControls;