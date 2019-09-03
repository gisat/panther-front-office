import _ from 'lodash';

const vuhu = (data) => {
	return data.map(item => {
		const {group_key, id, pocatek, ...props} = item;
		let series = [];
		_.forIn(props, (value, key) => {
			if ((value && value.length) || value === 0) {
				series.push({
					value: Number(_.replace(value, ',', '.'))*(-1),
					period: Number(key)
				});
			}
		});

		return {
			id: group_key, pocatek, data: series
		}
	});
};


const vuhu0 = (data) => {
	return data.map(item => {
		const {group_key, ...props} = item;
		let series = [];
		_.forIn(props, (value, key) => {
			if ((value && value.length) || value === 0) {
				series.push({
					value: Number(_.replace(value, ',', '.')),
					period: Number(key)
				});
			}
		});

		return {
			id: group_key, data: series
		}
	});
};

export default {
	vuhu,
	vuhu0
};