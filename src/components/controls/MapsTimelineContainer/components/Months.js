import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import Dimensions from 'react-dimensions';
import moment from 'moment';

import utils from '../../../../utils/utils';

class Months extends React.PureComponent {

	static propTypes = {

	};

	render() {

		console.log('Months#render props', this.props);

		let start = moment(this.props.period.start);
		let end = moment(this.props.period.end);
		let months = [];
		let current = moment(this.props.period.start);

		while (end > current || current.format('YYYY-MM') === end.format('YYYY-MM')) {
			months.push({
				month: current.format('YYYY-MM'),
				start: (current.format('YYYY-MM') === start.format('YYYY-MM')) ? start : moment(current).startOf('month'),
				end: (current.format('YYYY-MM') === end.format('YYYY-MM')) ? end : moment(current).endOf('month')
			});
			current.add(1,'month');
		}

		let ret = _.map(months, month => {
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

		return React.createElement('g', null, ret);
	}

}

export default Months;
