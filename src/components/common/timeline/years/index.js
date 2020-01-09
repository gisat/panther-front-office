import React from 'react';
import PropTypes from 'prop-types';
import Label from '../utils/textLabel';
import YearDash from './YearDash';
import MonthDash from '../months/MonthDash';
import {getYears, getMonths} from '../utils/interval';
import './style.css';

import _ from 'lodash';
import moment from 'moment';

export const Years = (props) => {
	const {period, getX, dayWidth, height, vertical} = props;
	const periodStart = moment(period.start);
	const periodEnd = moment(period.end);
	const yearsCfg = getYears(periodStart, periodEnd);
	
	const years = _.map(yearsCfg, year => {
		let x = getX(year.start);
		let label = <Label label={year.year} vertical={vertical} x={x} height={height} className={'ptr-timeline-year-label'} />
		return (<YearDash key={year.year} label={label} x={x} vertical={vertical}/>);
	});


	let months = [];

	//render every sixth month without label
	if(dayWidth > 0.7) {
		const monthsCfg = getMonths(periodStart, periodEnd);
		months = _.map(monthsCfg, month => {
			if(month.month === '07') {
				let x = getX(month.start);
				return (<MonthDash key={`${month.year}-${month.month}`} x={x} vertical={vertical}/>);
			} else {
				return null;
			}
		});
	}

	return (
		<g className={'levels'}>
			{months}{years.reverse()}
		</g>
	)
}

Years.propTypes = {
    period: PropTypes.shape({
		start: PropTypes.string,
		end: PropTypes.string,
	}).isRequired,
	getX: PropTypes.func.isRequired,
	dayWidth: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	vertical: PropTypes.bool,
  }

Years.defaultProps = {
	vertical: false,
}

export default Years;
