import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../config';

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
		let diff = date.unix() - moment(props.period[0]).unix();
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
			</svg>
		);
	}

	renderMonths(period) {
		let ret = [];
		let start = moment(period[0]);
		let end = moment(period[1]);
		let months = [];
		let current = moment(period[0]);

		while (end > current || current.format('M') === end.format('M')) {
			months.push({
				month: current.format('YYYY-MM'),
				start: (current.format('M') === start.format('M')) ? start : moment(current).startOf('month'),
				end: (current.format('M') === end.format('M')) ? end : moment(current).endOf('month')
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
					height="30"
				/>
			);
		});

	}

}

export default TimelineContent;
