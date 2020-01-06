import _ from 'lodash';

/**
 *
 * @param data {array}
 * @param valueSourcePaths {array}
 * @param serieSourcePath {string}
 * @param allValuesNull {boolean} if true, all values has to be null to filter the item out
 * @return {*}
 */
function filterDataWithNullValue (data, valueSourcePaths, serieSourcePath, allValuesNull) {
	if (!serieSourcePath) {
		return filterData(data, valueSourcePaths, allValuesNull);
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

function filterData (data, valueSourcePaths, allValuesNull) {
	return _.filter(data, (item) => {
		if (_.isArray(valueSourcePaths)) {
			if (allValuesNull) {
				let unfitFilter = 0;
				_.each(valueSourcePaths, (path) => {
					let val = _.get(item, path);
					if (!val && val !==0) {
						unfitFilter++;
					}
				});
				return unfitFilter !== valueSourcePaths.length;
			} else {
				let fitsFilter = true;
				_.each(valueSourcePaths, (path) => {
					let val = _.get(item, path);
					if (!val && val !==0) {
						fitsFilter = false
					}
				});
				return fitsFilter;
			}
		} else {
			let val = _.get(item, valueSourcePaths);
			return val || val === 0;
		}
	});
}

export default {
	filterDataWithNullValue
};