import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import viewHelpers from './viewHelpers';
import layersHelpers from "./layersHelpers";

import './style.scss';
import 'leaflet/dist/leaflet.css';

const DEFAULT_VIEW = {
	center: {
		lat: 45,
		lon: 10
	},
	boxRange: 10000000,
	tilt: 0,
	roll: 0,
	heading: 0
};

class LeafletMap extends React.PureComponent {
	static propTypes = {
		mapKey: PropTypes.string.isRequired,
		backgroundLayer: PropTypes.object,
		layers: PropTypes.array,
		view: PropTypes.object,

		onClick: PropTypes.func,
		onViewChange: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.onZoomChange = this.onZoomChange.bind(this);
		this.onMoveChange = this.onMoveChange.bind(this);
	}

	componentDidMount() {
		this.map = L.map(this.props.mapKey,{zoomAnimationThreshold: 2}).setView([DEFAULT_VIEW.center.lat, DEFAULT_VIEW.center.lon], viewHelpers.getZoomLevelFromBoxRange(DEFAULT_VIEW.boxRange));

		this.map.on("zoomend", this.onZoomChange);
		this.map.on("moveend", this.onMoveChange);

		this.updateView();
		this.updateLayers();
	}

	componentDidUpdate(prevProps) {
		// TODO compare references only?
		if (this.props.view && prevProps.view !== this.props.view) {
			this.updateView();
		}

		// TODO compare references only?
		if ((this.props.layers || this.props.backgroundLayer) && (prevProps.layers !== this.props.layers || prevProps.backgroundLayer !== this.props.backgroundLayer)) {
			this.updateLayers();
		}
	}

	updateLayers() {
		let layers = [];
		if (this.props.backgroundLayer) {
			layers.push(layersHelpers.getLayerByType(this.props.backgroundLayer));
		}

		if (this.props.layers) {
			this.props.layers.forEach((layer) => {
				layers.push(layersHelpers.getLayerByType(layer));
			});
		}

		// TODO optimalize - layer groups?
		this.map.eachLayer(layer => {
			this.map.removeLayer(layer);
		});

		layers.forEach(layer => {
			if (layer && !this.map.hasLayer(layer)) {
				this.map.addLayer(layer);
			}
		});
	}

	updateView() {
		const currentView = {...DEFAULT_VIEW, ...this.props.view};
		viewHelpers.update(this.map, currentView);
	}

	onZoomChange() {
		if (this.props.onViewChange) {
			let zoomLevel = this.map.getZoom();
			let center = this.map.getCenter();
			let boxRange = viewHelpers.getBoxRangeFromZoomLevel(zoomLevel);
			this.props.onViewChange({boxRange, center: {lon: center.lng, lat: center.lat}});
		}
	}

	onMoveChange() {
		if (this.props.onViewChange) {
			let center = this.map.getCenter();
			this.props.onViewChange({center: {lon: center.lng, lat: center.lat}});
		}
	}

	render() {
		return (
			<div className="ptr-leaflet-map" key={this.props.mapKey} id={this.props.mapKey}>
			</div>
		);

	}
}

export default LeafletMap;