import createCachedSelector from "re-reselect";
import _ from "lodash";

const getCompleteData = createCachedSelector(
	[
		(data) => data,
		(data, names) => names,
		(data, names, filter) => filter,
	],
	(data, names, filter) => {
		if (data && data.length) {
			let completeData = data;

			/* Filter */
			if (filter && filter.filteredKeys) {
				completeData = _.filter(data, (item) => {
					return _.indexOf(filter.filteredKeys, item.key) !== -1;
				});
			}

			/* Merge with names */
			if (names && names.length) {
				let mergedData = {};

				_.forEach(completeData, (record) => {
					mergedData[record.key] = {...record};
				});

				_.forEach(names, (nameRecord) => {
					let existingRecord = mergedData[nameRecord.key];
					if (existingRecord) {
						existingRecord.data.name = nameRecord.data.name;
					}
				});

				completeData = _.values(mergedData);
			}

			return completeData;
		} else {
			return [];
		}
	}
)((data, names, filter) => {
	return JSON.stringify(data[0]) + JSON.stringify(data[data.length - 1])  + JSON.stringify(names[0])  + JSON.stringify(names[names.length - 1]) + JSON.stringify(filter)
});

export default {
	getCompleteData
}