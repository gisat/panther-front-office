import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import utils from '../../../../utils/utils';

import TimelineContent from './components/TimelineContent';
import Tooltip from './components/Tooltip';

const CONTROLS_WIDTH = 0;
const MOUSE_BUFFER_WIDTH = 5;
const INITIAL_STATE = {
	mouseX: null,
	displayTooltip: false
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
		this.displayTooltip = this.displayTooltip.bind(this);
		this.hideTooltip = this.hideTooltip.bind(this);

		this.calculate(props);

		this.state = {
			period: {
				start: props.initialPeriod.start,
				end: props.initialPeriod.end
			},
			periodLimit: {
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

		let diff = end.diff(start, 'ms');
		let diffDays = diff / (60 * 60 * 24 * 1000);

		this.dimensions = {
			width: props.containerWidth - CONTROLS_WIDTH,
			days: diffDays,
			dayWidth: (props.containerWidth - CONTROLS_WIDTH)/diffDays
		};

		if (this.state.dayWidth) { // don't set state in constructor
			this.setState({
				dayWidth: this.dimensions.dayWidth
			});
		}
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
			e.preventDefault();
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

	displayTooltip() {
		this.setState({
			displayTooltip: true
		});
	}
	hideTooltip() {
		this.setState({
			displayTooltip: false
		});
	}

	/**
	 * Based on the amount of pixels the wheel moves update the size of the visible pixels.
	 * @param e {SyntheticEvent}
	 *
	 */
	onWheel(e) {
		let change;
		let mouseTime = this.getTime(this.state.mouseX);

		// only allow zoom inside data scope
		if (mouseTime.isAfter(this.props.initialPeriod.start) && mouseTime.isBefore(this.props.initialPeriod.end)) {
			if (e.deltaY > 0) {
				// zoom out
				change = 1 - Math.abs(e.deltaY / (10 * 100));
			} else {
				// zoom in
				change = 1 + Math.abs(e.deltaY / (10 * 100));
			}

			let newWidth = this.state.dayWidth * change;

			//don't allow zoom out outside initial zoom
			if (newWidth < this.dimensions.dayWidth) {
				newWidth = this.dimensions.dayWidth;
			}

			let beforeMouseDays = this.state.mouseX / newWidth;
			let afterMouseDays = (this.props.containerWidth - this.state.mouseX) / newWidth;
			let allDays = this.props.containerWidth / newWidth;

			let start = moment(mouseTime).subtract(moment.duration(beforeMouseDays * (60 * 60 * 24 * 1000), 'ms'));
			//let end = moment(mouseTime).add(moment.duration(afterMouseDays, 'days));
			let end = moment(start).add(moment.duration(allDays * (60 * 60 * 24 * 1000), 'ms'));

			// if zoomed out of initial period, save temporary period limit (for drag)
			if (start < this.props.initialPeriod.start) {
				this.setState({
					periodLimit: {
						start: moment(start),
						end: this.state.periodLimit.end
					}
				});
			}
			if (end > this.props.initialPeriod.end) {
				this.setState({
					periodLimit: {
						start: this.state.periodLimit.start,
						end: moment(end)
					}
				});
			}

			this.setState({
				dayWidth: newWidth,
				period: {
					start: start,
					end: end
				}
			});

		}
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
		let periodLimit = {...this.state.periodLimit};

    // Either add  to start and end.
		let daysChange = Math.abs(dragInfo.distance) / this.state.dayWidth;
		if(dragInfo.direction === 'past') {
			start.subtract(daysChange * (60 * 60 * 24 * 1000), 'ms');
      end.subtract(daysChange * (60 * 60 * 24 * 1000), 'ms');
      if(start.isBefore(this.state.periodLimit.start)) {
      	start = moment(this.state.periodLimit.start);
			}
			if (end.isBefore(this.state.periodLimit.end)) {
				if (end.isAfter(this.props.initialPeriod.end)) {
					periodLimit.end = moment(end);
				} else {
					periodLimit.end = moment(this.props.initialPeriod.end);
				}
			}
		} else {
			start.add(daysChange * (60 * 60 * 24 * 1000), 'ms');
			end.add(daysChange * (60 * 60 * 24 * 1000), 'ms');
			if(end.isAfter(this.state.periodLimit.end)) {
				end = moment(this.state.periodLimit.end);
			}
			if (start.isAfter(this.state.periodLimit.start)) {
				if (start.isBefore(this.props.initialPeriod.start)) {
					periodLimit.start = moment(start);
				} else {
					periodLimit.start = moment(this.props.initialPeriod.start);
				}
			}
		}


		let widthOfTimeline = this.dimensions.width;
		// If the result is smaller than width of the timeline
		let widthOfResult = (end.diff(start, 'ms') / (60 * 60 * 24 * 1000)) * this.state.dayWidth;
		// Make sure that we stay within the limits.
		if(widthOfResult < widthOfTimeline) {
			let daysNeededToUpdate = (widthOfTimeline - widthOfResult) / this.state.dayWidth;
			if(dragInfo.direction === 'past') {
				end.add(daysNeededToUpdate * (60 * 60 * 24 * 1000), 'ms');
			} else {
				start.subtract(daysNeededToUpdate * (60 * 60 * 24 * 1000), 'ms');
			}
		}

		this.setState({
			period: {
				start: start,
				end: end
			},
			periodLimit: periodLimit
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
			dataPeriod: this.props.initialPeriod,
			getX: this.getX,
			onMouseMove: this.onMouseMove,
			onMouseLeave: this.onMouseLeave,
			onMouseUp: this.onMouseUp,
			onMouseDown: this.onMouseDown,
      onWheel: this.onWheel,
      onDrag: this.onDrag,
			mouseX: this.state.mouseX,
			mouseBufferWidth: MOUSE_BUFFER_WIDTH,
			displayTooltip: this.displayTooltip,
			hideTooltip: this.hideTooltip,
		};
		children.push(React.createElement(TimelineContent, contentProps));

		if (this.state.mouseX && this.state.displayTooltip) {
			children.push(React.createElement(Tooltip, {
				key: 'mapsTimelineTooltip',
				mouseX: this.state.mouseX,
				getTime: this.getTime,
				layers: this.props.layers,
				containerWidth: this.props.containerWidth,
				mouseBufferWidth: MOUSE_BUFFER_WIDTH,
				activeLayers: this.props.activeLayers,
				dataPeriod: this.props.initialPeriod
			}));
		}

		return React.createElement('div', {className: 'ptr-timeline-container'}, children);
	}

}

export default MapsTimeline;
