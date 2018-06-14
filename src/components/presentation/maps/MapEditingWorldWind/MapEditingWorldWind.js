import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import WorldWind from '@nasaworldwind/worldwind';

import Layers from '../../../../view/worldWind/layers/Layers';
import Controls from '../../../../view/worldWind/controls/Controls';

import './MapEditingWorldWind.css';

class WorldWindow extends React.PureComponent {

	static propTypes = {
		activeBackgroundLayerKey: PropTypes.string,
		mapContainerClass: PropTypes.string
	};

	constructor(props){
		super(props);
		this.canvasId = "world-wind-canvas-map-editing";
	}

	componentDidMount(){
		this.wwd = new WorldWind.WorldWindow(this.canvasId);

		this.mapControls = new Controls({
			worldWindow: this.wwd,
			mapContainerClass: this.props.mapContainerClass
		});

		// TODO remove dependency on obsolete code
		this.layersControl = new Layers(this.wwd);
		if (this.props.activeBackgroundLayerKey){
			this.changeBackgroundLayer(this.props.activeBackgroundLayerKey);
		}
	}

	componentWillReceiveProps(nextProps, prevProps){
		if (_.isEmpty(prevProps) || (nextProps.activeBackgroundLayerKey !== prevProps.activeBackgroundLayerKey)){
			this.changeBackgroundLayer(nextProps.activeBackgroundLayerKey);
		}
	}

	changeBackgroundLayer(key){
		if (key){
			this.layersControl.removeAllLayersFromGroup('background-layers');
			this.layersControl.addBackgroundLayer(key, 'background-layers');
			this.wwd.redraw();
		}
	}

	render() {
		return (
			<div className="world-wind-container">
				<canvas className="world-wind-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
			</div>
		);
	}
}

export default WorldWindow;
