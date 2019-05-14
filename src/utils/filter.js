import _ from 'lodash';

function filterDataWithNullValue (data, valueSourcePath, serieSourcePath) {
	if (!serieSourcePath) {
		return _.filter(data, (item) => {
			return _.get(item, valueSourcePath);
		});
	} else {
		let withoutNullValues = data.map(item => {
			let data = _.get(item, serieSourcePath);
			let filteredData =_.filter(data, (value) => {
				return _.get(value, valueSourcePath);
			});

			let updatedItem = {...item};
			updatedItem[serieSourcePath] = filteredData;
			return updatedItem;
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