import React from 'react';
import PropTypes from 'prop-types';
import Label from '../utils/textLabel';
import MonthDash from './MonthDash';
import YearDash from '../years/YearDash';
import {getYears, getMonths} from '../utils/interval';
import './style.css';

import map from 'lodash/map';
import moment from 'moment';

const Months = (props) => {
	const {period, getX, dayWidth, height, vertical} = props;
	const periodStart = moment(period.start);
	const periodEnd = moment(period.end);
	const monthsCfg = getMonths(periodStart, periodEnd);
	const yearsCfg = getYears(periodStart, periodEnd);

	const months = map(monthsCfg, month => {
		if(month.month !== '01') {
			let x = getX(month.start);
			let label = null;
			if (dayWidth > 1.5) {
				label = (
					<Label label={month.month} vertical={vertical} x={x} height={height} className={'ptr-timeline-month-label'} />
				);
			}
	
			return (<MonthDash key={`${month.year}-${month.month}`} x={x} label={label} vertical={vertical} height={2}/>);
		} else {
			return null;
		}
	});

	const years = map(yearsCfg, year => {
		let x = getX(year.start);
		let label = <Label label={year.year} vertical={vertical} x={x} height={height} className={'ptr-timeline-year-label'} />
		return (<YearDash key={year.year} label={label} x={x} vertical={vertical}/>);
	});

	return (
		<g className={'levels'}>
			{months}{years.reverse()}
		</g>
	)
}


Months.propTypes = {
    period: PropTypes.shape({
		start: PropTypes.string,
		end: PropTypes.string,
	}).isRequired,
	getX: PropTypes.func.isRequired,
	dayWidth: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	vertical: PropTypes.bool,
  }

Months.defaultProps = {
	vertical: false,
}

export default Months;
