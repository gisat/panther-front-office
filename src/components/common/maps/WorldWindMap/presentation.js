import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../../utils/utils';
import _ from 'lodash';

import WorldWind from 'webworldwind-esa';
import decorateWorldWindowController from './controllers/WorldWindowControllerDecorator';
import navigator from './navigator/helpers';

import './style.scss';

const {WorldWindow, ElevationModel} = WorldWind;

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
	}

	componentDidMount() {
		this.wwd = new WorldWindow(this.canvasId, this.getElevationModel());

		decorateWorldWindowController(this.wwd.worldWindowController);
		this.wwd.worldWindowController.onNavigatorChanged = this.onNavigatorChange.bind(this);

		if (this.props.view){
			this.updateNavigator();
		}

		if (this.props.backgroundLayer) {
			this.wwd.layers = [this.props.backgroundLayer];
			this.wwd.redraw();
		}

	}

	componentDidUpdate(prevProps) {
		if (prevProps){
			if (this.props.view) {
				this.updateNavigator();
			}
		}
	}

	updateNavigator() {
		const currentView = {...DEFAULT_VIEW, ...this.props.view};
		navigator.update(this.wwd, currentView);
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
			const changedViewParams = navigator.getChangedViewParams({...DEFAULT_VIEW, ...this.props.view}, viewParams);

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

	render() {
		return (
			<div className="ptr-world-wind-map" onClick={this.props.onClick}>
				<canvas className="ptr-world-wind-map-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
			</div>
		);

	}
}

export default WorldWindMap;
