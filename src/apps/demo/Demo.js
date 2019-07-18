import React from 'react';
import _ from 'lodash';
import PresentationMapWithControls from "../../components/common/maps/PresentationMapWithControls";
import WorldWindMap from "../../components/common/maps/WorldWindMap/presentation";
import MapControls from "../../components/common/maps/MapControls/presentation";
import Select from "../../components/common/atoms/Select/Select";

const backgroundLayers = {
	wikimedia: {
		name: "Wikimedia",
		type: 'worldwind',
		options: {layer: 'wikimedia'}
	},
	bing: {
		name: "Bing Aerial",
		type: 'worldwind',
		options: {layer: 'bingAerial'}
	},
	bluemarble: {
		name: "Bluemarble",
		type: 'worldwind',
		options: {layer: 'bluemarble'}
	}
};

const backgroundLayersOptions = _.values(backgroundLayers);

class Demo extends React.PureComponent {
	constructor(props){
		super(props);

		this.state = {
			backgroundLayer: backgroundLayers.bing,
			view: {
				boxRange: 1000000
			}
		};

		this.onBackgroundChange = this.onBackgroundChange.bind(this);
	}

	onBackgroundChange(backgroundLayer) {
		this.setState({backgroundLayer});
	}

	render() {
		return (
			<div className="demo-app ptr-light">
				<div className="demo-maps">
					<PresentationMapWithControls
						map={<WorldWindMap {...this.state}/>}
						controls={<MapControls/>}
					/>
				</div>
				<div className="demo-control-panel">
					<h2>Background</h2>
					<Select
						onChange={this.onBackgroundChange}
						options={backgroundLayersOptions}
						optionLabel="name"
						optionValue="options.layer"
						value={this.state.backgroundLayer}
					/>
				</div>
			</div>
		);
	}
}

export default Demo;