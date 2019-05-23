import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from '../../../../utils/utils';
import _, {isEqual, isNull} from 'lodash';

import WorldWind from 'webworldwind-esa';

import navigator from './navigator/helpers';

import Attribution from './Attribution/Attribution';
import CyclicPickController from '../../../../utils/worldwind/CyclicPickController';

import './style.scss'

const {WorldWindow, ElevationModel} = WorldWind;

class WorldWindMap extends React.PureComponent {

	static propTypes = {
		backgroundLayer: PropTypes.array,
		elevationModel: PropTypes.string,
		layers: PropTypes.array,
		layersVectorData: PropTypes.object,
		navigator: PropTypes.object,
		mapKey: PropTypes.string,
		onWorldWindNavigatorChange: PropTypes.func,
		onHover: PropTypes.func,
		onHoverOut: PropTypes.func,
		setActiveMapKey: PropTypes.func,
		delayedWorldWindNavigatorSync: PropTypes.number,
		loadLayerData: PropTypes.func,
		label: PropTypes.string,
		rerendererSetter: PropTypes.func,
	};

	constructor(props) {
		super(props);
		this.canvasId = utils.uuid();
		this.changedNavigatorTimeout = false;
		this.setMapKeyTimeout = false;
	}

	componentDidMount() {
		this.wwd = new WorldWindow(this.canvasId, this.getElevationModel());
		this.wwd.addEventListener("mousemove", this.onNavigatorChange.bind(this));
		this.wwd.addEventListener("wheel", this.onNavigatorChange.bind(this));

		this.pickController = new CyclicPickController(this.wwd, ['mousemove', 'mousedown', 'mouseup', 'mouseout'], this.handleHover.bind(this));

		if (this.props.navigator){
			navigator.update(this.wwd, this.props.navigator);
		}

		if (this.props.layers || this.props.layers === null) {
			const layers = this.props.layers || [];
			this.handleLayers(layers);
		}

		if(typeof this.props.rerendererSetter === 'function') {
			this.props.rerendererSetter(() => this.wwd.redraw());
		}
}

	componentDidUpdate(prevProps) {
		if (prevProps){
			if (this.props.navigator) {
				navigator.update(this.wwd, this.props.navigator);
			}

			if (!isEqual(prevProps.layers, this.props.layers)) {
				const layers = this.props.layers || [];
				this.handleLayers(layers);
			}
		}
	}

	handleLayers(nextLayersData = []) {
		this.wwd.layers = nextLayersData;
		this.wwd.redraw();
	}

	/**
	 * Get attributions of all layers present in the map
	 * @returns {Array}
	 */
	getAttributions() {
		let attributions = [];

		if (this.props.backgroundLayer && this.props.backgroundLayer.data && this.props.backgroundLayer.data.attribution){
			attributions.push(this.props.backgroundLayer.data.attribution);
		}

		if (this.props.layers){
			this.props.layers.forEach(layer => {
				if (layer.data && layer.data.attribution){
					attributions.unshift(layer.data.attribution);
				}
			});
		}

		return attributions.length ? attributions : null;
	}

	/**
	 * @returns {null | ZeroElevationModel}
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
		if (event && event.worldWindow) {
			//setActive mapKey
			const changedNavigatorParams = navigator.getChangedParams(this.props.navigator, event.worldWindow.navigator);
			if (!_.isEmpty(changedNavigatorParams) && this.props.setActiveMapKey) {
				if(this.setMapKeyTimeout) {
					clearTimeout(this.setMapKeyTimeout);
				}
				this.setMapKeyTimeout = setTimeout(() => {this.props.setActiveMapKey()}, 100)
			}

			if(this.props.onWorldWindNavigatorChange) {
				if (!_.isEmpty(changedNavigatorParams)) {
					if (this.props.delayedWorldWindNavigatorSync) {
						if (this.changedNavigatorTimeout) {
							clearTimeout(this.changedNavigatorTimeout);
						}
						this.changedNavigatorTimeout = setTimeout(() => {
							this.props.onWorldWindNavigatorChange(changedNavigatorParams);
						}, this.props.delayedWorldWindNavigatorSync)
					} else {
						this.props.onWorldWindNavigatorChange(changedNavigatorParams);
					}
				}
			}
		}
	}

	handleHover(renderables) {
		if (this.props.onHover && renderables && renderables.length) {
			this.props.onHover(renderables);
		} else if (this.props.onHoverOut) {
			this.props.onHoverOut();
		}
	}

	render() {
		let attributions = this.getAttributions();

		return (
			<div className="ptr-world-wind-map" onClick={this.props.setActiveMapKey}>
				{
					this.props.label ? 
						(<div className={"map-label"}>
							{this.props.label}
						</div>) : null
				}
				<canvas className="ptr-world-wind-map-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
				{attributions ? <Attribution data={attributions}/> : null}
			</div>
		);

	}
}

export default WorldWindMap;
