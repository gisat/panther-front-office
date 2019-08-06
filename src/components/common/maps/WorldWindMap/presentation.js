import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import WorldWind from 'webworldwind-esa';
import decorateWorldWindowController from './controllers/WorldWindowControllerDecorator';
import layersHelpers from './layers/helpers';
import navigator from './navigator/helpers';
import {defaultMapView} from '../constants';

import './style.scss';

const {WorldWindow, ElevationModel} = WorldWind;

class WorldWindMap extends React.PureComponent {
	static defaultProps = {
		elevationModel: null
	};

	static propTypes = {
		backgroundLayer: PropTypes.object,
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
	}

	componentDidMount() {
		this.wwd = new WorldWindow(this.canvasId, this.getElevationModel());

		decorateWorldWindowController(this.wwd.worldWindowController);
		this.wwd.worldWindowController.onNavigatorChanged = this.onNavigatorChange.bind(this);

		this.updateNavigator(defaultMapView);
		this.updateLayers();

	}

	componentDidUpdate(prevProps) {
		if (prevProps){

			// TODO compare references only?
			if (this.props.view && prevProps.view !== this.props.view) {
				this.updateNavigator();
			}

			// TODO compare references only?
			if ((this.props.layers || this.props.backgroundLayer) && (prevProps.layers !== this.props.layers || prevProps.backgroundLayer !== this.props.backgroundLayer)) {
				this.updateLayers();
			}
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

		this.wwd.layers = layers;
		this.wwd.redraw();
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
		let currentView = navigator.getViewParamsFromWorldWindNavigator(this.wwd.navigator);
		this.props.onClick(currentView);
	}

	render() {
		return (
			<div className="ptr-world-wind-map" onClick={this.onClick}>
				<canvas className="ptr-world-wind-map-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
			</div>
		);

	}
}

export default WorldWindMap;
