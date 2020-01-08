import React from 'react';
import _ from 'lodash';
import Deprecated_PresentationMapWithControls from "../../components/common/maps/Deprecated_PresentationMapWithControls";
import WorldWindMap from "../../components/common/maps/WorldWindMap/presentation";
import LeafletMap from "../../components/common/maps/LeafletMap/presentation";
import MapControls from "../../components/common/maps/controls/MapControls/presentation";
import Select from "../../components/common/atoms/Select/Select";

import central_europe from "./data/central_europe";

const mapFrameworks = {
	leaflet: {
		name: "Leaflet",
		component: LeafletMap
	},
	worldWind: {
		name: "World Wind",
		component: WorldWindMap
	}
};

const backgroundLayers = {
	wmts: {
		key: 'wmts-wiki',
		name: "Wikimedia WMTS",
		type: 'wmts',
		options: {url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'}
	},
	wmtsOsm: {
		key: 'wmtsOsm',
		name: "OpenStreetMap",
		type: 'wmts',
		options: {url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
	},
	cartoLight: {
		key: 'cartoLight',
		name: "Carto Light",
		type: 'wmts',
		options: {url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'}
	},
	cartoDark: {
		key: 'cartoDark',
		name: "Carto Dark",
		type: 'wmts',
		options: {url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'}
	},
	stamenLite: {
		key: 'stamenLite',
		name: 'Stamen Lite',
		type: 'wmts',
		options: {
			url: 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'
		}
	},
	stamenTerrain: {
		key: 'stamenTerrain',
		name: 'Stamen Terrain',
		type: 'wmts',
		options: {
			url: 'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png'
		}
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
	},
	boundaries: {
		key: 'boundaries',
		name: 'Central Europe vector',
		type: 'vector',
		options: {
			features: central_europe
		}
	}
};

const mapFrameworkOptions = _.values(mapFrameworks);
const backgroundLayersOptions = _.values(backgroundLayers);
const layersOptions = _.values(layers);

class Demo extends React.PureComponent {
	constructor(props){
		super(props);

		this.state = {
			mapKey: 'map',
			mapFramework: mapFrameworks.worldWind,
			backgroundLayer: backgroundLayers.wmts,
			layers: [layers.boundaries],
			view: {
				center: {
					lat: 49.5,
					lon: 15
				},
				boxRange: 700000
			}
		};

		this.onMapFrameworkChange = this.onMapFrameworkChange.bind(this);
		this.onBackgroundChange = this.onBackgroundChange.bind(this);
		this.onLayersChange = this.onLayersChange.bind(this);
	}

	onMapFrameworkChange(mapFramework) {
		this.setState({mapFramework});
	}

	onBackgroundChange(backgroundLayer) {
		this.setState({backgroundLayer});
	}

	onLayersChange(layers) {
		this.setState({layers});
	}

	render() {
		const {mapFramework, ...state} = this.state;


		return (
			<div className="demo-app ptr-light">
				<div className="demo-maps">
					<Deprecated_PresentationMapWithControls
						map={React.createElement(mapFramework.component, state)}
						controls={mapFramework.name === 'World Wind' ? <MapControls zoomOnly/> :<MapControls levelsBased zoomOnly/>}
					/>
				</div>
				<div className="demo-control-panel">
					<h2>Map framework</h2>
					<Select
						onChange={this.onMapFrameworkChange}
						options={mapFrameworkOptions}
						optionLabel="name"
						optionValue="name"
						value={mapFramework}
					/>

					<h2>Background</h2>
					<Select
						onChange={this.onBackgroundChange}
						options={backgroundLayersOptions}
						optionLabel="name"
						optionValue="key"
						value={state.backgroundLayer}
					/>

					<h2>Layers</h2>
					<Select
						clearable
						multi
						onChange={this.onLayersChange}
						options={layersOptions}
						optionLabel="name"
						optionValue="key"
						value={state.layers}
					/>
				</div>
			</div>
		);
	}
}

export default Demo;