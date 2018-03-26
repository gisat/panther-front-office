import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import Dimensions from 'react-dimensions';
import moment from 'moment';

import utils from '../../../../utils/utils';

class Days extends React.PureComponent {

	static propTypes = {

	};

	render() {

		console.log('Days#render props', this.props);

		let start = moment(this.props.period.start);
		let end = moment(this.props.period.end);
		let days = [];
		let current = moment(this.props.period.start);

		while (end > current || current.format('D') === end.format('D')) {
			days.push({
				day: current.format('YYYY-MM-DD'),
				start: (current.format('YYYY-MM-DD') === start.format('YYYY-MM-DD')) ? start : moment(current).startOf('day'),
				end: (current.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')) ? end : moment(current).endOf('day')
			});
			current.add(1,'day');
		}

		let ret = _.map(days, day => {
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

		return React.createElement('g', null, ret);
	}

}

export default Days;
