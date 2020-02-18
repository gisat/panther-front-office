import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

import {utils} from '@gisatcz/ptr-utils'

class Years extends React.PureComponent {

	static propTypes = {

	};

	render() {

		//console.log('Years#render props', this.props);

		let start = moment(this.props.period.start);
		let end = moment(this.props.period.end);
		let years = [];
		let current = moment(this.props.period.start);

		while (end > current || current.format('YYYY') === end.format('YYYY')) {
			years.push({
				year: current.format('YYYY'),
				start: (current.format('YYYY') === start.format('YYYY')) ? start : moment(current).startOf('year'),
				end: (current.format('YYYY') === end.format('YYYY')) ? end : moment(current).endOf('year')
			});
			current.add(1,'year');
		}

		let ret = _.map(years, year => {
			let start = this.props.getX(year.start);
			let end = this.props.getX(year.end);
			let label = null;
			if (this.props.dayWidth < 1.5) {
				label = (
					<text
						x={start + 3}
						y={this.props.height - 2}
						className="ptr-timeline-year-label"
					>
						{year.year}
					</text>
				);
			}
			return (
				<g
					key={year.year}
					className={classNames("ptr-timeline-year", {background: this.props.background})}
				>
					<line
						x1={start + 0.5}
						x2={start + 0.5}
						y1={0}
						y2={this.props.height}
					/>
					{label}
				</g>
			);
		});

		return React.createElement('g', null, ret);
	}

}

export default Years;
