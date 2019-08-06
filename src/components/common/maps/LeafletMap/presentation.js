import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import viewHelpers from './viewHelpers';
import layersHelpers from './layersHelpers';
import utils from '../viewUtils';
import {defaultMapView} from '../constants';

import './style.scss';
import 'leaflet/dist/leaflet.css';

class LeafletMap extends React.PureComponent {
	static propTypes = {
		mapKey: PropTypes.string.isRequired,
		backgroundLayer: PropTypes.object,
		layers: PropTypes.array,
		view: PropTypes.object,

		scale: PropTypes.bool,

		onClick: PropTypes.func,
		onViewChange: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.state = {
			layers: null
		};

		this.onZoomChange = this.onZoomChange.bind(this);
		this.onMoveChange = this.onMoveChange.bind(this);
	}

	componentDidMount() {
		const initialView = {...defaultMapView, ...this.props.view};

		/* Setup leaflet map
		*	- hide default zoom and attribution controls
		*	- set view
		*/
		this.map = L
			.map(this.props.mapKey,{zoomAnimationThreshold: 2, zoomControl: false, attributionControl: false})
			.setView([initialView.center.lat, initialView.center.lon], utils.getZoomLevelFromView(initialView));

		this.map.on("zoomend", this.onZoomChange);
		this.map.on("moveend", this.onMoveChange);

		if (this.props.scale) {
			L.control.scale().addTo(this.map);
		}

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
		// TODO optimalize - layer groups?
		this.map.eachLayer(layer => {
			this.map.removeLayer(layer);
		});

		let layers = [];
		if (this.props.backgroundLayer) {
			layers.push(layersHelpers.getLayerByType(this.props.backgroundLayer, this.map));
		}

		if (this.props.layers) {
			this.props.layers.forEach((layer) => {
				layers.push(layersHelpers.getLayerByType(layer, this.map));
			});
		}

		this.setState({
			layers
		});
	}

	updateView() {
		// TODO merge with current view
		const nextView = {...defaultMapView, ...this.props.view};
		viewHelpers.update(this.map, nextView);
	}

	onZoomChange() {
		if (this.props.onViewChange) {
			let zoomLevel = this.map.getZoom();
			let center = this.map.getCenter();
			let boxRange = utils.getBoxRangeFromZoomLevelAndLatitude(zoomLevel, center.lat);
			this.props.onViewChange({boxRange, center: {lon: center.lng, lat: center.lat}});
		}
	}

	onMoveChange() {
		if (this.props.onViewChange) {
			let center = this.map.getCenter();
			this.props.onViewChange({center: {lon: center.lng, lat: center.lat}});
		}
	}

	onClick() {
		// TODO
		// this.props.onClick(currentView);
	}

	render() {
		return (
			<div className="ptr-leaflet-map" key={this.props.mapKey} id={this.props.mapKey} onClick={this.onClick}>
				{this.state.layers}
			</div>
		);

	}
}

export default LeafletMap;
