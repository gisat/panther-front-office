import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import Dimensions from 'react-dimensions';
import moment from 'moment';

import utils from '../../../../utils/utils';

class TimelineContent extends React.PureComponent {

	static propTypes = {

	};

	getX(date, props) {
		props = props || this.props;
		date = moment(date);
		let diff = date.unix() - moment(props.period.start).unix();
		let diffDays = diff / (60 * 60 * 24);
		return diffDays * props.dayWidth;
	}

	render() {

		console.log('TimelineContent#render props', this.props);

		return (
			<svg
				width={this.props.width}
				height={this.props.height}
			>
				{this.renderMonths(this.props.period)}
				{this.renderDays(this.props.period)}
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
				start: (current.format('YYYY-MM') === start.format('YYYY-MM')) ? start : moment(current).startOf('month'),
				end: (current.format('YYYY-MM') === end.format('YYYY-MM')) ? end : moment(current).endOf('month')
			});
			current.add(1,'month');
		}

		return _.map(months, month => {
			let start = this.getX(month.start);
			let end = this.getX(month.end);
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
			let start = this.getX(day.start);
			let end = this.getX(day.end);
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
