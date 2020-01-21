import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import map from 'lodash/map';
import moment from 'moment';
import {getYears, getMonths, getDays, getHours} from '../utils/interval';
import Label from '../utils/textLabel';
import HourDash from '../hours/HourDash';
import DayDash from './DayDash';
import MonthDash from '../months/MonthDash';
import YearDash from '../years/YearDash';

const Days = (props) => {
	const {period, getX, dayWidth, height, vertical} = props;
	const periodStart = moment(period.start);
	const periodEnd = moment(period.end);
	const daysCfg = getDays(periodStart, periodEnd);
	const monthsCfg = getMonths(periodStart, periodEnd);
	const yearsCfg = getYears(periodStart, periodEnd);

	const months = map(monthsCfg, month => {
		if(month.month !== '01') {
			let x = getX(month.start);
			let label = (<Label label={month.month} vertical={vertical} x={x} height={height} className={'ptr-timeline-month-label'} />);
			return (<MonthDash key={`${month.year}-${month.month}`} x={x} label={label} vertical={vertical} height={1}/>);
		} else {
			return null;
		}
	});

	const years = map(yearsCfg, year => {
		let x = getX(year.start);
		let label = <Label label={year.year} vertical={vertical} x={x} height={height} className={'ptr-timeline-year-label'} />
		return (<YearDash key={year.year} label={label} x={x} vertical={vertical}/>);
	});

	const days = map(daysCfg, day => {
		let x = getX(day.start);
		let label = null;
		if (dayWidth > 17) {
			label = (
				<Label label={day.day} vertical={vertical} x={x} height={height} className={'ptr-timeline-day-label'} />
			);
		}
		return (<DayDash key={`${day.year}-${day.month}-${day.day}`} label={label} x={x} vertical={vertical} height={2}/>);
	});
	
	let hours = null;
	if (dayWidth > 150) {
		const hoursCfg = getHours(periodStart, periodEnd);
		hours = map(hoursCfg, hour => {
			if(hour.hour === '12') {
				let x = getX(hour.start);
				return (<HourDash key={`${hour.year}-${hour.month}-${hour.day}-${hour.hour}`} x={x} vertical={vertical} height={3}/>);
			} else {
				return null;
			}
		});
	}

	return(
		<g className={'levels'}>
			{hours}{days}{months}{years.reverse()}
		</g>
	);
};


Days.propTypes = {
    period: PropTypes.shape({
		start: PropTypes.string,
		end: PropTypes.string,
	}).isRequired,
	getX: PropTypes.func.isRequired,
	dayWidth: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	vertical: PropTypes.bool,
  }

Days.defaultProps = {
	vertical: false,
}


export default Days;