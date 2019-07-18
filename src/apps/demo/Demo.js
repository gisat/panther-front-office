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

const layers = {
	nightlights: {
		key: 'nightlights',
		name: 'Nightlights',
		type: 'wms',
		opacity: 0.5,
		options: {
			url: 'https://utep.it4i.cz/geoserver/ESA_UTEP_EXT/wms',
			params: {
				layers: 'SVDNB_2015_v10'
			}
		}
	},
	guf12m: {
		key: 'guf12m',
		name: 'Global Urban Footprint',
		type: 'wms',
		opacity: 1,
		options: {
			url: 'https://utep.it4i.cz/geoserver/ESA_UTEP/wms',
			params: {
				layers: 'GUF04'
			}
		}
	},
	gufDens: {
		key: 'gufDens',
		name: 'GUF Density',
		type: 'wms',
		opacity: 1,
		options: {
			url: 'https://utep.it4i.cz/geoserver/ESA_UTEP/wms',
			params: {
				layers: 'GUF10_DenS'
			}
		}
	}
};

const backgroundLayersOptions = _.values(backgroundLayers);
const layersOptions = _.values(layers);

class Demo extends React.PureComponent {
	constructor(props){
		super(props);

		this.state = {
			backgroundLayer: backgroundLayers.wikimedia,
			layers: [layers.nightlights, layers.gufDens, layers.guf12m],
			view: {
				center: {
					lat: 49.5,
					lon: 15
				},
				boxRange: 700000
			}
		};

		this.onBackgroundChange = this.onBackgroundChange.bind(this);
		this.onLayersChange = this.onLayersChange.bind(this);
	}

	onBackgroundChange(backgroundLayer) {
		this.setState({backgroundLayer});
	}

	onLayersChange(layers) {
		this.setState({layers});
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

					<h2>Layers</h2>
					<Select
						clearable
						multi
						onChange={this.onLayersChange}
						options={layersOptions}
						optionLabel="name"
						optionValue="key"
						value={this.state.layers}
					/>
				</div>
			</div>
		);
	}
}

export default Demo;