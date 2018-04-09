import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import utils from '../../../../utils/utils';

import TimelineContent from './TimelineContent';
import Tooltip from './Tooltip';

const CONTROLS_WIDTH = 0;
const MOUSE_BUFFER_WIDTH = 5;
const INITIAL_STATE = {
	mouseX: null
};

class MapsTimeline extends React.PureComponent {

	static propTypes = {
		period: PropTypes.shape({
			start: PropTypes.object,
			end: PropTypes.object
		}).isRequired,
		initialPeriod: PropTypes.shape({
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
		this.getTime = this.getTime.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onWheel = this.onWheel.bind(this);
		this.onDrag = this.onDrag.bind(this);

		this.calculate(props);

		this.state = {
			period: {
				start: props.initialPeriod.start,
				end: props.initialPeriod.end
			},
			dayWidth: this.dimensions.dayWidth
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.containerWidth != this.props.containerWidth) {
			this.calculate(nextProps);
		}
	}


	calculate(props) {
		let start = moment(props.initialPeriod.start);
		let end = moment(props.initialPeriod.end);

		let diff = end.diff(start, 'days');

		this.dimensions = {
			width: props.containerWidth - CONTROLS_WIDTH,
			days: diff,
			dayWidth: (props.containerWidth - CONTROLS_WIDTH)/diff
		};

		this.setState({
			dayWidth: this.dimensions.dayWidth
		});
	}

	getX(date, props) {
		date = moment(date);
		let diff = date.unix() - moment(this.state.period.start).unix();
		let diffDays = diff / (60 * 60 * 24);
		return diffDays * this.state.dayWidth;
	}

	getTime(x, props) {
		let diffDays = x / this.state.dayWidth;
		let diff = diffDays * (60 * 60 * 24 * 1000);
		return moment(this.state.period.start).add(moment.duration(diff, 'ms'));
	}


	onMouseMove(e) {
		this.setState({
			mouseX: e.clientX
		});

		if(this._drag) {
			let distance = e.clientX - this._lastX;
			if(distance !== 0) {
				this.onDrag({
					distance: Math.abs(distance),
					direction: distance < 0 ? 'future': 'past'
				});

				this._lastX = e.clientX;
			}
		}
	}
	onMouseLeave(e) {
		this.setState({
			mouseX: null
		});
	}

	onMouseUp() {
		console.log('onMouseUp');
		this._drag = false;
		this._lastX = null;
	}
	onMouseDown(e) {
		console.log('onMouseDown');
		this._drag = true;
		this._lastX = e.clientX;
	}

	/**
	 * Based on the amount of pixels the wheel moves update the size of the visible pixels.
	 * @param e {SyntheticEvent}
	 *
	 */
	onWheel(e) {
		let change;
		let mouseTime = this.getTime(this.state.mouseX);
		if (e.deltaY > 0) {
			// zoom out
			change = 1 - Math.abs(e.deltaY / (10 * 100));
		} else {
			// zoom in
			change = 1 + Math.abs(e.deltaY / (10 * 100));
		}

		let newWidth = this.state.dayWidth * change;

		//for now, don't allow zoom outside initial period - todo better solution
		if (newWidth < this.dimensions.dayWidth) {
			newWidth = this.dimensions.dayWidth;
		}

		let beforeMouseDays = this.state.mouseX / newWidth;
		let afterMouseDays = (this.props.containerWidth - this.state.mouseX) / newWidth;
		let allDays = this.props.containerWidth / newWidth;

		let start = moment(mouseTime).subtract(moment.duration(beforeMouseDays * (60 * 60 * 24 * 1000), 'ms'));
		//let end = moment(mouseTime).add(moment.duration(afterMouseDays, 'days));
		let end = moment(start).add(moment.duration(allDays * (60 * 60 * 24 * 1000), 'ms'));

		//for now, don't allow zoom outside initial period - todo better solution
		if (start < this.props.initialPeriod.start) {
			let outOfIntervalDiff = this.props.initialPeriod.start - start;
			start = moment(this.props.initialPeriod.start);
			end = end.add(outOfIntervalDiff);
		}
		if (end > this.props.initialPeriod.end) {
			let outOfIntervalDiff = end - this.props.initialPeriod.end;
			end = moment(this.props.initialPeriod.end);
			start = start.subtract(outOfIntervalDiff);
		}

		this.setState({
			dayWidth: newWidth,
			period: {
				start: start,
				end: end
			}
		});
	}

	/**
	 * When the user drags the timeline, if it is still permitted, it updates the available and visible period and
	 * therefore redraws the information.
	 * @param dragInfo {Object}
	 * @param dragInfo.distance {Number} Amount of pixels to move in given direction
	 * @param dragInfo.direction {String} Either past or future. Based on this.
	 */
	onDrag(dragInfo) {
		let start = moment(this.state.period.start);
    let end = moment(this.state.period.end);

    // Either add  to start and end.
		let daysChange = Math.abs(dragInfo.distance) / this.state.dayWidth;
		if(dragInfo.direction === 'past') {
			start.subtract(daysChange, 'days');
      end.subtract(daysChange, 'days');
      if(start.isBefore(this.props.initialPeriod.start)) {
      	start = moment(this.props.initialPeriod.start);
			}
		} else {
			start.add(daysChange, 'days');
			end.add(daysChange, 'days');
			if(end.isAfter(this.props.initialPeriod.end)) {
				end = moment(this.props.initialPeriod.end);
			}
		}


		let widthOfTimeline = this.dimensions.width;
		// If the result is smaller than width of the timeline
		let widthOfResult = end.diff(start, 'days') * this.state.dayWidth;
		// Make sure that we stay within the limits.
		if(widthOfResult < widthOfTimeline) {
			let daysNeededToUpdate = (widthOfTimeline - widthOfResult) / this.state.dayWidth;
			if(dragInfo.direction === 'past') {
				end.add(daysNeededToUpdate, 'days');
			} else {
				start.subtract(daysNeededToUpdate, 'days');
			}
		}

		this.setState({
			period: {
				start: start,
				end: end
			}
		});
	}

	// Make sure that the size doesn't change.

	render() {

		let children = [];
		let {maps, activeMapKey, ...contentProps} = this.props; // consume unneeded props (though we'll probably use them in the future)
		contentProps = {...contentProps,
			key: 'mapsTimelineContent',
			width: this.dimensions.days * this.dimensions.dayWidth,
			dayWidth: this.state.dayWidth,
			period: this.state.period,
			getX: this.getX,
			onMouseMove: this.onMouseMove,
			onMouseLeave: this.onMouseLeave,
			onMouseUp: this.onMouseUp,
			onMouseDown: this.onMouseDown,
      onWheel: this.onWheel,
      onDrag: this.onDrag,
			mouseX: this.state.mouseX,
			mouseBufferWidth: MOUSE_BUFFER_WIDTH
		};
		children.push(React.createElement(TimelineContent, contentProps));

		if (this.state.mouseX) {
			children.push(React.createElement(Tooltip, {
				key: 'mapsTimelineTooltip',
				mouseX: this.state.mouseX,
				getTime: this.getTime,
				layers: this.props.layers,
				containerWidth: this.props.containerWidth,
				mouseBufferWidth: MOUSE_BUFFER_WIDTH,
				activeLayers: this.props.activeLayers
			}));
		}

		return React.createElement('div', {className: 'ptr-timeline-container'}, children);
	}

}

export default MapsTimeline;
