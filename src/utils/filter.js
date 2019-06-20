import _ from 'lodash';

function filterDataWithNullValue (data, valueSourcePaths, serieSourcePath) {
	if (!serieSourcePath) {
		return filterData(data, valueSourcePaths);
	} else {
		let withoutNullValues = _.map(data, item => {
			let data = _.get(item, serieSourcePath);
			let filteredData = filterData(data, valueSourcePaths);
			return _.set({...item}, serieSourcePath, filteredData);
		});

		return _.filter(withoutNullValues, (item) => {
			let data = _.get(item, serieSourcePath);
			return data && data.length !== 0;
		});
	}
}

function filterData (data, valueSourcePaths) {
	return _.filter(data, (item) => {
		if (_.isArray(valueSourcePaths)) {
			let fitsFilter = true;
			_.each(valueSourcePaths, (path) => {
				let val = _.get(item, path);
				if (!val && val !==0) {
					fitsFilter = false
				}
			});
			return fitsFilter;

		} else {
			let val = _.get(item, valueSourcePaths);
			return val || val === 0;
		}
	});
}

export default {
	filterDataWithNullValue
};