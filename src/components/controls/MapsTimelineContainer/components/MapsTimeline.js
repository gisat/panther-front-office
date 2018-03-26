import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import utils from '../../../../utils/utils';
import TimelineContent from './TimelineContent';

const CONTROLS_WIDTH = 0;

/*
HOw do we figure out what is the time we want to display? It is part of the received props.

Zooming
  Happens on mouse wheel event and changes the year width by ten percent.
  After this change the TimelineContent is rerendered.
Moving
  Updates the period that is provided to the timeline content.
  10% change when the user drags to the left or right.

What is the relationship between the prop period and the movement? Is it that the prop period is the one that is displayed
by default and then we allow for.

Initial period.
Max period.

 */
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
		props.initialize();

		this.calculate = this.calculate.bind(this);
		this.getX = this.getX.bind(this);
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
		props = props || this.props;
		date = moment(date);
		let diff = date.unix() - moment(props.period.start).unix();
		let diffDays = diff / (60 * 60 * 24);
		return diffDays * this.state.dayWidth;
	}

	getTime(x, props) {
		props = props || this.props;
		let diffDays = x / this.state.dayWidth;
		let diff = diffDays * (60 * 60 * 24);
		return moment(props.period.start).add(diff, 's');
	}


	onMouseOver(e) {
		console.log(e.clientX, this.getTime(e.clientX));
	}
	onMouseLeave(e) {
		console.log('out');
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
        if(e.deltaY < 0) {
            change = 1 - Math.abs(e.deltaY / (100 * 100));
            end.subtract((end.diff(start) * Math.abs(e.deltaY / (100 * 100))));
		} else {
            change = 1 + Math.abs(e.deltaY / (100 * 100));
            end.add((end.diff(start) * Math.abs(e.deltaY / (100 * 100))));
		}

		let newWidth = this.state.dayWidth * change;

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

        let change = end.diff(start) * 0.1;
        if(dragInfo.direction === 'past') {
			start.subtract(change);
            end.subtract(change);
            if(start.isBefore(moment(this.props.period.start))) {
                start = this.props.period.start;
            }
		} else {
        	end.add(change);
            start.add(change);
            if(end.isAfter(moment(this.props.period.end))) {
                end = this.props.period.end;
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
		return (
			<div className="ptr-timeline-container">
				<TimelineContent
					height="40"
					period={this.state.period}


					width={this.dimensions.days * this.dimensions.dayWidth}
					dayWidth={this.state.dayWidth}

					layers={this.props.layers}
					getX={this.getX}
					onMouseOver={this.onMouseOver}
					onMouseLeave={this.onMouseLeave}

					onWheel={this.onWheel}
					onDrag={this.onDrag}
				/>
			</div>
		);
	}

}

export default MapsTimeline;
