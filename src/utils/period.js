import moment from 'moment';

const parse = (string) => {
	if (string.match(/\//)) {
		let dates = string.split('/');
		return [
			moment(dates[0]),
			moment(dates[1])
		];
	}
	if (string.match(/^[0-9]{4}$/)) {
		//calendar year
		return [
			moment(string),
			moment(new Date(String(+string + 1)) - 1)
		];
	}
	if (string.match(/^[0-9]{4}-[0-9]{2}$/)) {
		//calendar month
		return [
			moment(string),
			moment(string).endOf('month')
		];
	}
};

export default parse;