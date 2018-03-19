import moment from 'moment';

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
			end: parseOne(dates[1]).end
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
			end: moment(string).endOf('year')
		};
	}
	if (string.match(/^[0-9]{4}-[0-9]{2}$/)) {
		// month
		return {
			start: moment(string),
			end: moment(string).endOf('month')
		};
	}
	if (string.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
		// day
		return {
			start: moment(string),
			end: moment(string).endOf('day')
		};
	}
	if (string.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}$/)) {
		// hour
		return {
			start: moment(string),
			end: moment(string).endOf('hour')
		};
	}
	if (string.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/)) {
		// minute
		return {
			start: moment(string),
			end: moment(string).endOf('minute')
		};
	}
	if (string.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/)) {
		// second
		return {
			start: moment(string),
			end: moment(string).endOf('second')
		};
	}
	if (string.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
		// full datetime incl. timezone
		return {
			start: moment(string),
			end: moment(string).endOf('second')
		};
	}
};

export default parse;