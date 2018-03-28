import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import utils from '../../../../utils/utils';
import TimelineContent from './TimelineContent';

const CONTROLS_WIDTH = 0;
const INITIAL_STATE = {
	mouseX: null
};

class MapsTimeline extends React.PureComponent {

	static propTypes = {
		period: PropTypes.shape({
			start: PropTypes.object,
			end: PropTypes.object
		}).isRequired
	};

	//static defaultProps = {
	//
	//};

	constructor(props) {
		super();
		this.state = {...INITIAL_STATE};
		props.initialize();

		this.calculate = this.calculate.bind(this);
		this.getX = this.getX.bind(this);
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);

		this.calculate(props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.containerWidth != this.props.containerWidth) {
			this.calculate(nextProps);
		}
	}


	calculate(props) {
		let start = moment(props.period.start);
		let end = moment(props.period.end);

		let diff = end.diff(start, 'days');

		this.dimensions = {
			width: props.containerWidth - CONTROLS_WIDTH,
			days: diff,
			dayWidth: (props.containerWidth - CONTROLS_WIDTH)/diff
		};
	}

	getX(date, props) {
		props = props || this.props;
		date = moment(date);
		let diff = date.unix() - moment(props.period.start).unix();
		let diffDays = diff / (60 * 60 * 24);
		return diffDays * this.dimensions.dayWidth;
	}

	getTime(x, props) {
		props = props || this.props;
		let diffDays = x / this.dimensions.dayWidth;
		let diff = diffDays * (60 * 60 * 24);
		return moment(props.period.start).add(diff, 's');
	}


	onMouseOver(e) {
		this.setState({
			mouseX: e.clientX
		});
	}
	onMouseLeave(e) {
		this.setState({
			mouseX: null
		});
	}


	render() {

		let tooltip = null;
		if (this.state.mouseX) {
			let width = 50;
			let height = 50;
			let left = 0;
			if (this.state.mouseX < width/2) {

			} else if (this.state.mouseX > (this.props.containerWidth - width/2)) {
				left = this.props.containerWidth - width;
			} else {
				left = this.state.mouseX - Math.round(width/2);
			}
			tooltip = (
				<div
					className="ptr-timeline-tooltip"
					style={{
						left: left,
						bottom: (this.props.layers && this.props.layers.length || 0) * 10 + 30,
						width: width,
						height: height
					}}
				>

				</div>
			);
		}

		return (
			<div className="ptr-timeline-container">
				<TimelineContent
					height="40"
					period={this.props.period}
					width={this.dimensions.days * this.dimensions.dayWidth}
					dayWidth={this.dimensions.dayWidth}
					layers={this.props.layers}
					activeLayers={this.props.activeLayers}
					activeLayerPeriods={this.props.activeLayerPeriods}
					getX={this.getX}
					onMouseOver={this.onMouseOver}
					onMouseLeave={this.onMouseLeave}
					onLayerPeriodClick={this.props.onLayerPeriodClick}
				/>
				{tooltip}
			</div>
		);
	}

}

export default MapsTimeline;
