import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _ from 'lodash';
import WorldWind from '@nasaworldwind/worldwind';
import ExtendedOsmLayer from './layers/ExtendedOsmLayer';
import ExtendedWmsLayer from './layers/ExtendedWmsLayer';

import './style.css'

const {Location, Sector, WorldWindow} = WorldWind;

class WorldWindMap extends React.PureComponent {

	static propTypes = {
		backgroundLayer: PropTypes.object,
		layers: PropTypes.array,
		navigator: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.canvasId = utils.uuid();
	}

	componentDidMount() {
		this.wwd = new WorldWindow(this.canvasId);

		if (this.props.backgroundLayer) {
			this.addBackgroundLayer(this.props.backgroundLayer);
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps){
			// this.comapreBackgroundLayers(prevProps.backgroundLayer, this.props.backgroundLayer);
		}
	}

	compareBackgroundLayers(prevLayer, nextLayer) {

	}

	addBackgroundLayer(layer) {
		if (layer.data && layer.data.type){
			switch (layer.data.type){
				case "wms":
					this.addWmsLayer(layer);
					break;
				case "wmts":
					this.addWmtsLayer(layer);
					break;
			}
		}
	}

	addWmsLayer(layer){
		this.wwd.insertLayer(0, new ExtendedWmsLayer({
				...layer.data,
				service: layer.data.url,
				sector: new Sector(-90, 90, -180, 180),
				levelZeroDelta: new Location(45, 45),
				format: "image/png",
				size: 256,
				version: "1.3.0",
			}, null));
	}

	addWmtsLayer(layer) {
		this.wwd.insertLayer(0, new ExtendedOsmLayer(layer.data, null));
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
