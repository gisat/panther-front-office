import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {utils} from '@gisatcz/ptr-utils'
import {CyclicPickController, ClickPickController} from '@gisatcz/ptr-utils';
import _, {isEqual, isNull} from 'lodash';

import WorldWind from 'webworldwind-esa';
import decorateWorldWindowController from './controllers/WorldWindowControllerDecorator';
import navigator from './navigator/helpers';

import Attribution from './Attribution/Attribution';

import './style.scss'
import {Button} from '@gisatcz/ptr-atoms';
import {Menu, MenuItem} from '@gisatcz/ptr-atoms';

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
		onClick: PropTypes.func,
		onDownloadAsPng: PropTypes.func,
		setActiveMapKey: PropTypes.func,
		delayedWorldWindNavigatorSync: PropTypes.number,
		loadLayerData: PropTypes.func,
		label: PropTypes.string,
		rerendererSetter: PropTypes.func,
	};

	constructor(props) {
		super(props);
		this.canvasId = props.mapKey + '-canvas';
		this.changedNavigatorTimeout = false;
		this.setMapKeyTimeout = false;
	}

	componentDidMount() {
		this.wwd = new WorldWindow(this.canvasId, this.getElevationModel());

		decorateWorldWindowController(this.wwd.worldWindowController);
		this.wwd.worldWindowController.onNavigatorChanged = this.onNavigatorChange.bind(this);

		this.pickController = new CyclicPickController(this.wwd, ['mousemove', 'mousedown', 'mouseup', 'mouseout', 'touchstart', 'touchmove', 'touchend'], this.handleHover.bind(this));

		if(this.props.onClick) {
			this.clickController = new ClickPickController(this.wwd, this.handleClick.bind(this));
		}

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
		if (event) {
			//setActive mapKey
			const changedNavigatorParams = navigator.getChangedParams(this.props.navigator, event);
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

	handleHover(renderables, e, showPopup) {
		if (this.props.onHover && renderables && renderables.length) {
			this.props.onHover(renderables, e.clientX, e.clientY, showPopup, this.props.mapKey);
		} else if (this.props.onHoverOut) {
			this.props.onHoverOut();
		}
	}

	handleClick(renderables, e) {
		this.props.onClick(renderables, e.clientX, e.clientY, this.props.mapKey);
	}

	renderMenu() {
		return (
			<div className={"map-label-menu"}>
				<Button icon="dots" invisible onClick={()=>{}}>
					<Menu bottom right>
						{this.props.onDownloadAsPng ? <MenuItem onClick={this.props.onDownloadAsPng.bind(this, this.wwd, this.canvasId)}>Download as PNG</MenuItem> : null}
					</Menu>
				</Button>
			</div>
		);
	}

	render() {
		let attributions = this.getAttributions();

		return (
			<div className="ptr-world-wind-map" onClick={this.props.setActiveMapKey} id={this.props.mapKey}>
				{
					this.props.label ? 
						(<div className={"map-label"}>
							<div className={"map-label-title"}>{this.props.label}</div>
							{this.props.onDownloadAsPng ? this.renderMenu() : null}
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
