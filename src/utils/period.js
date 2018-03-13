
const parse = (string) => {
	if (string.match(/\//)) {
		let dates = string.split('/');
		return [
			new Date(dates[0]),
			new Date(dates[1])
		];
	}
	if (string.match(/^[0-9]{4}$/)) {
		//calendar year
		return [
			new Date(string),
			new Date(new Date(String(+string + 1)) - 1)
		];
	}
	if (string.match(/^[0-9]{4}-[0-9]{2}$/)) {
		//calendar month
		let end = new Date(string);
		end.setMonth(end.getMonth() + 1); //todo breaks when crossing daylight savings change?
		return [
			new Date(string),
			new Date(end - 1)
		];
	}
};

export default parse;