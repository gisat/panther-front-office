import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import WorldWind from '@nasaworldwind/worldwind';

import layers from './layers/helpers';
import navigator from './navigator/helpers';

import './style.css'

const {WorldWindow, ZeroElevationModel} = WorldWind;

class WorldWindMap extends React.PureComponent {

	static propTypes = {
		backgroundLayer: PropTypes.object,
		elevationModel: PropTypes.string,
		layers: PropTypes.array,
		navigator: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.canvasId = utils.uuid();

		// TODO only for testing
		setTimeout(this.compareBackgroundLayers.bind(this, this.props.backgroundLayer, {
				key: "stamen-uuid",
				data: {
					key: "stamen-uuid",
					name: "Stamen terrain",
					type: "wmts-osm-based",
					url: "http://tile.stamen.com/terrain",

					attribution: null,
					numLevels: null,
			     	opacity: null,
					prefixes: ["a", "b", "c"]
				}
			}), 5000);
	}

	componentDidMount() {
		this.wwd = new WorldWindow(this.canvasId, this.getElevationModel());

		if (this.props.backgroundLayer) {
			this.addBackgroundLayer(this.props.backgroundLayer);
		}

		if (this.props.navigator){
			navigator.update(this.wwd, this.props.navigator);
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps){
			this.compareBackgroundLayers(prevProps.backgroundLayer, this.props.backgroundLayer);
			navigator.update(this.wwd, this.props.navigator);
		}
	}

	addBackgroundLayer(layerData) {
		if (layerData.data && layerData.data.type){
			switch (layerData.data.type){
				case "wms":
					this.wwd.insertLayer(0, layers.getWmsLayer(layerData.data));
					break;
				case "wmts-osm-based":
					this.wwd.insertLayer(0, layers.getWmtsOsmBasedLayer(layerData.data));
					break;
			}
		}
	}

	compareBackgroundLayers(prevLayerData, nextLayerData) {
		if (nextLayerData && prevLayerData.key !== nextLayerData.key){
			this.addBackgroundLayer(nextLayerData);
			layers.removeLayer(this.wwd, prevLayerData.key);
			this.wwd.redraw();
		}
	}

	/**
	 * @returns {null | ZeroElevationModel}
	 */
	getElevationModel() {
		switch (this.props.elevationModel) {
			case "default":
				return null;
			case null:
				return new ZeroElevationModel();
		}
	}

	render() {
		return (
			<div className="ptr-world-wind-map">
				<canvas className="ptr-world-wind-map-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
			</div>
		);

	}
}

export default WorldWindMap;
