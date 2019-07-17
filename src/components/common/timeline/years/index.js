import React from 'react';
import PropTypes from 'prop-types';
import Label from '../utils/textLabel';
import {D1} from '../utils/dash';
import YearDash from './YearDash';
import MonthDash from '../months/MonthDash';
import {getYears, getMonths} from '../utils/interval';
import './style.css';

import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

export const Years = (props) => {
	const {periodLimit, getX, dayWidth, height, vertical} = props;
	const periodStart = moment(periodLimit.start);
	const periodEnd = moment(periodLimit.end);
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

export default Years;
