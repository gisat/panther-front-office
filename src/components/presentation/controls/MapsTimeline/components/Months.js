import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

import {utils} from '@gisatcz/ptr-utils'

class Months extends React.PureComponent {

	static propTypes = {

	};

	render() {

		//console.log('Months#render props', this.props);

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
			let label = null;
			if (!this.props.background && this.props.dayWidth > 1.5) {
				label = (
					<text
						x={start + 3}
						y={this.props.height - 2}
						className="ptr-timeline-month-label"
					>
						{month.month}
					</text>
				);
			}
			return (
				<g
					key={month.month}
					className={classNames("ptr-timeline-month", (+month.start.format('M') % 2) ? 'odd' : 'even', {
						background: this.props.background
					})}
				>
					<rect
						x={start}
						width={end-start}
						y={0}
						height={this.props.height}
					/>
					{label}
				</g>
			);
		});

		return React.createElement('g', null, ret);
	}

}

export default Months;
