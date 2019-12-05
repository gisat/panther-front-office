import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import WorldWind from 'webworldwind-esa';
import decorateWorldWindowController from './controllers/WorldWindowControllerDecorator';
import layersHelpers from './layers/helpers';
import navigator from './navigator/helpers';
import {defaultMapView} from '../../../../constants/Map';

import HoverContext from "../../../../components/common/HoverHandler/context";

import './style.scss';
import viewUtils from "../viewUtils";
import {defaultLevelsRange, numberOfLevels} from "../constants";
import LargeDataLayer from "./layers/LargeDataLayerSource/LargeDataLayer";

const {WorldWindow, ElevationModel} = WorldWind;

class WorldWindMap extends React.PureComponent {
	static contextType = HoverContext;

	static defaultProps = {
		elevationModel: null
	};

	static propTypes = {
		backgroundLayer: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.array
		]),
		layers: PropTypes.array,
		view: PropTypes.object,

		onClick: PropTypes.func,
		onViewChange: PropTypes.func,

		elevationModel: PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.canvasId = utils.uuid();

		this.onClick = this.onClick.bind(this);
		this.onHover = this.onHover.bind(this);
		this.onZoomLevelsBased = this.onZoomLevelsBased.bind(this);
	}

	componentDidMount() {
		this.wwd = new WorldWindow(this.canvasId, this.getElevationModel());

		decorateWorldWindowController(this.wwd.worldWindowController);
		this.wwd.worldWindowController.onNavigatorChanged = this.onNavigatorChange.bind(this);

		if (this.props.levelsBased) {
			// rewrite default wheel listener.
			this.wwd.eventListeners.wheel.listeners = [this.onZoomLevelsBased.bind(this)];
		}

		this.updateNavigator(defaultMapView);
		this.updateLayers();

	}

	onZoomLevelsBased(e) {
		e.preventDefault();
		if (e.wheelDelta) {
			let zoomLevel = viewUtils.getZoomLevelFromView(this.props.view);

			if (e.wheelDelta > 0) {
				zoomLevel++;
			} else {
				zoomLevel--;
			}

			let levelsRange = this.props.levelsBased.length ? this.props.levelsBased : defaultLevelsRange;
			if (zoomLevel <= levelsRange[1] && zoomLevel >= levelsRange[0]) {
				const boxRange = viewUtils.getBoxRangeFromZoomLevelAndLatitude(zoomLevel);
				if (this.props.onViewChange) {
					this.props.onViewChange({
						boxRange
					});
				}
			}
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps){
			if (this.props.view && prevProps.view !== this.props.view) {
				this.updateNavigator();
			}

			if (prevProps.layers !== this.props.layers || prevProps.backgroundLayer !== this.props.backgroundLayer) {
				this.updateLayers();
			}

			if (this.context && this.context.hoveredItems) {
				const currentHoveredItemsString = JSON.stringify(_.sortBy(this.context.hoveredItems));
				if (currentHoveredItemsString !== this.previousHoveredItemsString) {
					this.updateHoveredFeatures();
				}
			}
		}
	}

	updateLayers() {
		let layers = [];
		if (this.props.backgroundLayer) {
			// TODO fix for compatibility
			let backgroundLayers = _.isArray(this.props.backgroundLayer) ? this.props.backgroundLayer : [this.props.backgroundLayer];

			backgroundLayers.forEach((layer) => {
				layers.push(layersHelpers.getLayerByType(layer, this.wwd));
			});
		}

		if (this.props.layers) {
			this.props.layers.forEach((layer) => {
				let mapLayer = null;

				// TODO working for LargeDataLayer only
				if (layer.type === 'vector') {
					mapLayer = layersHelpers.updateVectorLayer(layer, this.wwd, this.onHover);
				}

				// TODO more sophisticated comparison for other layer types
				else {
					mapLayer = layersHelpers.getLayerByType(layer, this.wwd, this.onHover);
				}

				layers.push(mapLayer);
			});
		}

		this.wwd.layers = layers;
		this.wwd.redraw();
	}

	updateHoveredFeatures() {
		this.wwd.layers.forEach(layer => {
			if (layer instanceof LargeDataLayer) {
				layer.updateHoveredKeys(this.context.hoveredItems);
			}
		});
		this.wwd.redraw();
		this.previousHoveredItemsString = JSON.stringify(_.sortBy(this.context.hoveredItems));
	}

	updateNavigator(defaultView) {
		let currentView = defaultView || navigator.getViewParamsFromWorldWindNavigator(this.wwd.navigator);
		let nextView = {...currentView, ...this.props.view};
		navigator.update(this.wwd, nextView);
	}

	/**
	 * @returns {null | elevation}
	 */
	getElevationModel() {
		switch (this.props.elevationModel) {
			case "default":
				return null;
			case null:
				const elevation = new ElevationModel();
				elevation.removeAllCoverages();
				return elevation;
		}
	}

	onNavigatorChange(event) {
		if (event) {
			const viewParams = navigator.getViewParamsFromWorldWindNavigator(event);
			const changedViewParams = navigator.getChangedViewParams({...defaultMapView, ...this.props.view}, viewParams);

			if(this.props.onViewChange) {
				if (!_.isEmpty(changedViewParams)) {
					if (this.props.delayedWorldWindNavigatorSync) {
						if (this.changedNavigatorTimeout) {
							clearTimeout(this.changedNavigatorTimeout);
						}
						this.changedNavigatorTimeout = setTimeout(() => {
							this.props.onViewChange(changedViewParams);
						}, this.props.delayedWorldWindNavigatorSync)
					} else {
						this.props.onViewChange(changedViewParams);
					}
				}
			}
		}
	}

	onClick() {
		if (this.props.onClick) {
			let currentView = navigator.getViewParamsFromWorldWindNavigator(this.wwd.navigator);
			this.props.onClick(currentView);
		}
	}

	onHover(layerKey, featureKeys, x, y, popupContent, data) {
		// pass data to popup
		if (this.context && this.context.onHover) {
			this.context.onHover(featureKeys, {
				popup: {
					x,
					y,
					content: popupContent,
					data
				}
			});
		}

		// pass data to map state (global or local)
		// if (this.props.onLayerFeaturesHover) {
		// 	this.props.onLayerFeaturesHover(layerKey, featureKeys);
		// }
	}

	render() {
		return (
			<div className="ptr-map ptr-world-wind-map" onClick={this.onClick}>
				<canvas className="ptr-world-wind-map-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
			</div>
		);

	}
}

export default WorldWindMap;
