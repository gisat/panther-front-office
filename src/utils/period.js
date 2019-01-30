import moment from 'moment';
import _ from 'lodash';

const parse = string => {
	if (string.match(/\/P/)) {
		// start date & duration
		throw new Error('Durations not implemented');
	}
	if (string.match(/\//)) {
		// start & end date
		let dates = string.split('/');
		return {
			start: parseOne(dates[0]).start,
			end: parseOne(dates[1]).end,
			source: string,
			type: 'interval'
		};
	}
	// anything else
	return parseOne(string);

};

const parseOne = string => {
	if (string.match(/^[0-9]{4}$/)) {
		// year
		return {
			start: moment(string),
			end: moment(string).endOf('year'),
			source: string,
			type: 'year'
		};
	}
	if (string.match(/^[0-9]{4}-[0-9]{2}$/)) {
		// month
		return {
			start: moment(string),
			end: moment(string).endOf('month'),
			source: string,
			type: 'month'
		};
	}
	if (string.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
		// day
		return {
			start: moment(string),
			end: moment(string).endOf('day'),
			source: string,
			type: 'day'
		};
	}
	if (string.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}$/)) {
		// hour
		return {
			start: moment(string),
			end: moment(string).endOf('hour'),
			source: string,
			type: 'hour'
		};
	}
	if (string.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/)) {
		// minute
		return {
			start: moment(string),
			end: moment(string).endOf('minute'),
			source: string,
			type: 'minute'
		};
	}
	if (
		string.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/)
		|| string.match(/^[0-9]{4}[0-9]{2}[0-9]{2}T[0-9]{2}[0-9]{2}[0-9]{2}$/)
	) {
		// second
		return {
			start: moment(string),
			end: moment(string).endOf('second'),
			source: string,
			type: 'second'
		};
	}
	if (string.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
		// full datetime incl. timezone
		return {
			start: moment(string),
			end: moment(string).endOf('second'),
			source: string,
			type: 'full'
		};
	}
};

export default parse;

export const toString = period => {
	if (!(_.isObject(period) && period.start && period.end && period.type)) throw new Error('Invalid period supplied to period.toString');
	switch (period.type) {
		case 'interval':
			return period.start.format('YYYY-MM-DD h:mm:ss') + ' - ' + period.end.format('YYYY-MM-DD h:mm:ss');
		case 'second':
		case 'full':
			return period.start.format('YYYY-MM-DD h:mm:ss');
		case 'minute':
			return period.start.format('YYYY-MM-DD h:mm');
		case 'hour':
			return period.start.format('YYYY-MM-DD h') + 'h';
		default:
			return period.source;
	}
};