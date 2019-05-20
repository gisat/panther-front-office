import _ from 'lodash';

function filterDataWithNullValue (data, valueSourcePath, serieSourcePath) {
	if (!serieSourcePath) {
		return _.filter(data, (item) => {
			let val = _.get(item, valueSourcePath);
			return val || val === 0;
		});
	} else {
		let withoutNullValues = data.map(item => {
			let data = _.get(item, serieSourcePath);
			let filteredData =_.filter(data, (value) => {
				let val =  _.get(value, valueSourcePath);
				return val || val === 0;
			});

			return _.set({...item}, serieSourcePath, filteredData);
		});

		return _.filter(withoutNullValues, (item) => {
			let data = _.get(item, serieSourcePath);
			return data && data.length !== 0;
		});
	}
}

export default {
	filterDataWithNullValue
};