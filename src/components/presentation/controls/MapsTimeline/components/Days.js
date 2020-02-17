import React from 'react';
import PropTypes from 'prop-types';
import config from '../../../../../config/index';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

import {utils} from "panther-utils"

class Days extends React.PureComponent {

	static propTypes = {

	};

	render() {

		//console.log('Days#render props', this.props);

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
			let monday = day.start.format('dddd') === 'Monday';
			if (this.props.dayWidth > 2 || (this.props.dayWidth > 0.3 && monday)) {
				let height = this.props.height;
				if (!this.props.background) {
					height = monday ? height - 12 : height - 15
				}
				return (
					<line
						key={day.day}
						x1={start + 0.5}
						x2={start + 0.5}
						y1={0}
						y2={height}
						className={classNames("ptr-timeline-day", day.start.format('dddd'), {background: this.props.background})}
					/>
				);
			} else {
				return null;
			}
		});

		return React.createElement('g', null, ret);
	}

}

export default Days;
