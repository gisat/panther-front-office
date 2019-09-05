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
		scrollWheelZoom: PropTypes.string,

		onClick: PropTypes.func,
		onViewChange: PropTypes.func,
	};

	constructor(props) {
		super(props);

		this.state = {
			backgroundLayer: null,
			layers: null
		};

		this.onZoomChange = this.onZoomChange.bind(this);
		this.onMoveChange = this.onMoveChange.bind(this);
		this.onClick = this.onClick.bind(this);
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

		this.backgroundLayer = L.layerGroup().addTo(this.map);
		this.layers = L.layerGroup().addTo(this.map);

		this.map.on("zoomend", this.onZoomChange);
		this.map.on("moveend", this.onMoveChange);

		if (this.props.scale) {
			L.control.scale().addTo(this.map);
		}

		this.handleScrollWheelZoom();
		this.updateBackgroundLayer();
		this.updateLayers();
	}

	componentDidUpdate(prevProps) {
		if (this.props.view && prevProps.view !== this.props.view) {
			this.updateView();
		}

		if (prevProps.backgroundLayer !== this.props.backgroundLayer) {

			// TODO handle update properly
			this.clearBackgroundLayer();

			let self = this;
			setTimeout(() => {
				self.updateBackgroundLayer();
			}, 200);
		}

		if (prevProps.layers !== this.props.layers) {

			// TODO handle update properly
			this.clearLayers();

			let self = this;
			setTimeout(() => {
				self.updateLayers();
			}, 200);
		}
	}

	clearBackgroundLayer() {
		this.backgroundLayer.clearLayers();
		this.setState({
			backgroundLayer: null
		});
	}

	clearLayers() {
		this.layers.clearLayers();
		this.setState({
			layers: null
		});
	}

	updateBackgroundLayer() {
		let backgroundLayer = null;
		if (this.props.backgroundLayer) {
			backgroundLayer = layersHelpers.getLayerByType(this.props.backgroundLayer, this.backgroundLayer, 1);
		}

		this.setState({
			backgroundLayer
		});
	}

	updateLayers() {
		let layers = [];

		if (this.props.layers) {
			this.props.layers.forEach((layer) => {
				layers.push(layersHelpers.getLayerByType(layer, this.layers, 2));
			});
		}

		this.setState({
			layers
		});
	}

	updateView() {
		this.map.off("zoomend", this.onZoomChange);
		this.map.off("moveend", this.onMoveChange);

		let currentView = this.getCurrentView();
		let nextView = {...currentView, ...this.props.view};
		viewHelpers.update(this.map, nextView);

		this.map.on("zoomend", this.onZoomChange);
		this.map.on("moveend", this.onMoveChange);
	}

	handleScrollWheelZoom() {
		if (this.props.scrollWheelZoom === 'disabled') {
			this.map.scrollWheelZoom.disable();
		} else if (this.props.scrollWheelZoom === 'afterClick') {
			this.map.scrollWheelZoom.disable();
			this.map.on("click", () => {
				this.map.scrollWheelZoom.enable();
			});
		}
	}

	onZoomChange() {
		if (this.props.onViewChange) {
			this.props.onViewChange({
				boxRange: this.getBoxRange(),
				center: this.getCenter()
			});
		}
	}

	onMoveChange() {
		if (this.props.onViewChange) {
			this.props.onViewChange({
				center: this.getCenter()
			});
		}
	}

	onClick() {
		if (this.props.onClick) {
			let currentView = this.getCurrentView();
			this.props.onClick(currentView);
		}
	}

	getCurrentView() {
		return {
			boxRange: this.getBoxRange(),
			center: this.getCenter()
		};
	}

	getCenter() {
		let center = this.map.getCenter();
		return {
			lon: center.lng,
			lat: center.lat
		}
	}

	getBoxRange() {
		let center = this.getCenter();
		let zoomLevel = this.map.getZoom();
		return utils.getBoxRangeFromZoomLevelAndLatitude(zoomLevel, center.lat);
	}

	render() {
		return (
			<div className="ptr-map ptr-leaflet-map" key={this.props.mapKey} id={this.props.mapKey} onClick={this.onClick}>
				{this.state.backgroundLayer}
				{this.state.layers}
			</div>
		);

	}
}

export default LeafletMap;
