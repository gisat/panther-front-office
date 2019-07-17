import React from 'react';

import map from 'lodash/map';
import moment from 'moment';
import {getMinutes, getHours} from '../utils/interval';
import Label from '../utils/textLabel';
import MinuteDash from './MinuteDash';
import HourDash from '../hours/HourDash';
import './style.css';

const Minutes = (props) => {
	const {periodLimit, getX, dayWidth, height, vertical} = props;
	const periodStart = moment(periodLimit.start);
	const periodEnd = moment(periodLimit.end);
	const hoursCfg = getHours(periodStart, periodEnd);
	const minutesCfg = getMinutes(periodStart, periodEnd);

	let hours = map(hoursCfg, hour => {
		let x = getX(hour.start);
		const label = (
				<Label label={hour.hour} vertical={vertical} x={x} height={height} className={'ptr-timeline-day-label'} />
			);
		return (<HourDash key={`minutes-${hour.year}-${hour.month}-${hour.day}-${hour.hour}`} label={label} x={x} vertical={vertical} height={1}/>);
	});

	const minutes = map(minutesCfg, minute => {
		let x = getX(minute.start);
		let label = null
		
		if(dayWidth > 20000) {
			label = (
				<Label label={minute.minute} vertical={vertical} x={x} height={height} className={'ptr-timeline-day-label'} />
			);
		}

		return (<MinuteDash key={`minutes-${minute.year}-${minute.month}-${minute.day}-${minute.hour}-${minute.minute}`} label={label} x={x} vertical={vertical} height={3}/>);
	});
	return (
		<g className={'levels'}>
			{minutes}{hours.reverse()}
		</g>
	)
}

export default Minutes;
