import React from 'react';
import PropTypes from 'prop-types';
import MapsTimelinePresentation from './../../../presentation/controls/MapsTimeline/MapsTimeline';
import ReactResizeDetector from 'react-resize-detector';
import utils from '../../../../utils/utils';
import _ from 'lodash';

class MapsTimeline extends React.PureComponent {

	constructor(){
		super();

		this.state = {
			width: null
		};

		this.onLayerPeriodClick = this.onLayerPeriodClick.bind(this);
		this.onResize = this.onResize.bind(this);
	}

	handleLayerPeriod(layerKey, periodString){
		let layerPeriods = this.props.activeLayerPeriods;
		let isActive = layerPeriods && layerPeriods[layerKey] && layerPeriods[layerKey] === periodString;
		let mapKey = this.props.activeMapKey;

		if (isActive){
			this.props.clearLayerPeriod(layerKey, mapKey);
		} else {
			this.props.selectLayerPeriod(layerKey, periodString, mapKey);
		}
	}

	handleWmsLayer(layerKey){
		let isActive = _.find(this.props.activeLayers, (key) => {return key === layerKey});
		let mapKey = this.props.activeMapKey;

		if (isActive){
			this.props.clearWmsLayer(layerKey, mapKey);
		} else {
			this.props.selectWmsLayer(layerKey, mapKey);
		}
	}

	onLayerPeriodClick(layerKey, periodString) {
		if (periodString === 'all') {
			this.handleWmsLayer(layerKey);
		} else {
			this.handleLayerPeriod(layerKey, periodString);
		}
	}

	onResize(width, height) {
		this.setState({
			width: width
		});
	}


	render() {

		let timeline = null;
		if (this.props.scope && this.props.period && this.state.width) {

			let {scope, period, ...props} = this.props;
			timeline =  React.createElement(MapsTimelinePresentation, {...props,
				period:  utils.period(period.period),
        initialPeriod: utils.period(period.period),
				onLayerPeriodClick: this.onLayerPeriodClick,
				containerWidth: this.state.width
			});

		}

		return (
			<div>
				<ReactResizeDetector handleWidth onResize={this.onResize} />
				{timeline}
			</div>
		);
	}

}

export default MapsTimeline;
