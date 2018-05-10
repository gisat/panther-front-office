import React from 'react';
import PropTypes from 'prop-types';
import mapUtils from '../../../utils/map';
import _ from 'lodash';
import WorldWind from '@nasaworldwind/worldwind';

import './WorldWindow.css';

class WorldWindow extends React.PureComponent {

	static propTypes = {
		bbox: PropTypes.string,
		caseGeometry: PropTypes.object,
		zoomToGeometry: PropTypes.bool
	};

	constructor(props){
		super(props);
		this.canvasId = "world-wind-canvas-case-detail";
		this.state = {
			bbox: props.bbox,
			caseGeometry: props.caseGeometry
		};
	}

	componentWillReceiveProps(nextProps, prevState){
		let geometry = null;
		let bbox = null;

		if (nextProps.caseGeometry){
			geometry = nextProps.caseGeometry;
			// todo draw geometry
			this.zoomToGeometry(nextProps);
		} else if (nextProps.bbox){
			bbox = nextProps.bbox;
			this.zoomToGeometry(nextProps)
		}

		this.setState({
			caseGeometry: geometry,
			bbox: bbox
		});
	}

	zoomToGeometry(props){
		if (props.zoomToGeometry){
			let navigatorParams = null;
			if (props.caseGeometry){
				navigatorParams = mapUtils.getNavigatorParamsFromGeometry(props.caseGeometry, this.wwd.viewport);
			} else if (props.bbox){
				navigatorParams = mapUtils.getNavigatorParamsFromBbox(props.bbox, this.wwd.viewport);
			}
			if (navigatorParams){
				this.wwd.navigator.lookAtLocation.latitude = navigatorParams.lookAtLocation.latitude;
				this.wwd.navigator.lookAtLocation.longitude = navigatorParams.lookAtLocation.longitude;
				this.wwd.navigator.range = navigatorParams.range;
				this.wwd.redraw();
			}
		}
	}

	componentDidMount(){
		this.wwd = new WorldWind.WorldWindow(this.canvasId);
		let backgroundLayer = new WorldWind.BingAerialWithLabelsLayer(null);
		this.wwd.addLayer(backgroundLayer);
		if (this.props.zoomToGeometry){
			this.zoomToGeometry(this.props);
		}
	}

	render() {
		return (
			<div className="world-wind-globe">
				<canvas className="world-wind-canvas" id={this.canvasId}>
					Your browser does not support HTML5 Canvas.
				</canvas>
			</div>
		);
	}
}

export default WorldWindow;
