import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import Dimensions from 'react-dimensions';
import moment from 'moment';

import utils from '../../../../utils/utils';

import Layers from './Layers';

/*
Necessary updates
  The minimum size for what is shown is 4px
  The size is changing at 10% speed with the wheel movement.
  If the size is big enough we draw the month text
    Month names. Is it possible to figure out the size? As for names of the months it should be ok to use the first
    three letters
  If the size is big enough we draw the day name
    First two letters should be big enough.
  If the size is big enough we draw the hour
    Always two letters 01 to 24


  The Layers contain the information about points that are available there.
 */
class TimelineContent extends React.PureComponent {

	static propTypes = {

	};

	constructor(props) {
		super(props);

		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);

		this._drag = false;
		this._lastX = null;
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
	onMouseMove(e) {
		if(this._drag) {
            let distance = e.clientX - this._lastX;
            if(distance !== 0) {
                this.props.onDrag({
                    distance: Math.abs(distance),
                    direction: distance < 0 ? 'future': 'past'
                });

                this._lastX = e.clientX;
            }
		}
	}

	render() {

		console.log('TimelineContent#render props', this.props);

		return (
			<svg
				width={this.props.width}
				height={this.props.height}
				onMouseOver={this.props.onMouseOver}
				onMouseLeave={this.props.onMouseLeave}
				onWheel={this.props.onWheel}

				onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseMove={this.onMouseMove}
			>
                {this.renderMonths(this.props.period)}
				{this.renderDays(this.props.period)}
                <Layers
					layers={this.props.layers}
					dayWidth={this.props.dayWidth}
					getX={this.props.getX}
				/>
			</svg>
		);
	}

	renderMonths(period) {
		let ret = [];
		let start = moment(period.start);
		let end = moment(period.end);
		let months = [];
		let current = moment(period.start);

		while (end > current || current.format('YYYY-MM') === end.format('YYYY-MM')) {
			months.push({
				month: current.format('YYYY-MM'),
				monthName: current.format('MMM'),
				start: (current.format('YYYY-MM') === start.format('YYYY-MM')) ? start : moment(current).startOf('month'),
				end: (current.format('YYYY-MM') === end.format('YYYY-MM')) ? end : moment(current).endOf('month')
			});
			current.add(1,'month');
		}

		return _.map(months, month => {
			let start = this.props.getX(month.start);
			let end = this.props.getX(month.end);
			return (
				<rect
					key={month.month}
					x={start}
					width={end-start}
					y={0}
					height="40"
					className="ptr-timeline-month"
				/>
			);
		});

	}

	renderDays(period) {
		let ret = [];
		let start = moment(period.start);
		let end = moment(period.end);
		let days = [];
		let current = moment(period.start);

		while (end > current || current.format('D') === end.format('D')) {
			days.push({
				day: current.format('YYYY-MM-DD'),
				start: (current.format('YYYY-MM-DD') === start.format('YYYY-MM-DD')) ? start : moment(current).startOf('day'),
				end: (current.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')) ? end : moment(current).endOf('day')
			});
			current.add(1,'day');
		}

		return _.map(days, day => {
			let start = this.props.getX(day.start);
			let end = this.props.getX(day.end);
			return (
				<line
					key={day.day}
					x1={start}
					x2={start}
					y1={0}
					y1={day.start.format('dddd') === 'Monday' ? 28 : 25}
					className={classNames("ptr-timeline-day", day.start.format('dddd'))}
				/>
			);
		});

	}
}

export default TimelineContent;
