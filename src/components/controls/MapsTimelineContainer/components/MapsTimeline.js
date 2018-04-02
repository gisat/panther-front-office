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
		this.onMouseOver = this.onMouseOver.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
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
	}

	getX(date, props) {
		date = moment(date);
		let diff = date.unix() - moment(this.state.period.start).unix();
		let diffDays = diff / (60 * 60 * 24);
		return diffDays * this.state.dayWidth;
	}

	getTime(x, props) {
		let diffDays = x / this.state.dayWidth;
		let diff = diffDays * (60 * 60 * 24);
		return moment(this.state.period.start).add(diff, 's');
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

    /**
	 * Based on the amount of pixels the wheel moves update the size of the visible pixels.
     * @param e {SyntheticEvent}
	 *
     */
	onWheel(e){
		let change;
        let start = moment(this.state.period.start);
        let end = moment(this.state.period.end);
        if(e.deltaY > 0) {
            change = 1 - Math.abs(e.deltaY / (100 * 100));
            end.subtract((end.diff(start) * Math.abs(e.deltaY / (100 * 100))));
		} else {
            change = 1 + Math.abs(e.deltaY / (100 * 100));
            end.add((end.diff(start) * Math.abs(e.deltaY / (100 * 100))));
		}

		let newWidth = this.state.dayWidth * change;

        let diff = end.diff(start, 'days');
        if((newWidth * diff) < this.dimensions.width) {
        	newWidth = this.dimensions.width / this.dimensions.days;
        	start = this.props.initialPeriod.start;
        	end = this.props.initialPeriod.end;
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
			width: this.dimensions.days * this.dimensions.dayWidth,
			dayWidth: this.state.dayWidth,
			period: this.state.period,
			getX: this.getX,
			onMouseOver: this.onMouseOver,
			onMouseLeave: this.onMouseLeave,
            onWheel: this.onWheel,
            onDrag: this.onDrag
		};
		children.push(React.createElement(TimelineContent, contentProps));

		if (this.state.mouseX) {
			children.push(React.createElement(Tooltip, {
				mouseX: this.state.mouseX,
				getTime: this.getTime,
				layers: this.props.layers,
				containerWidth: this.props.containerWidth,
				mouseBufferWidth: MOUSE_BUFFER_WIDTH
			}));
		}

		return React.createElement('div', {className: 'ptr-timeline-container'}, children);
	}

}

export default MapsTimeline;
