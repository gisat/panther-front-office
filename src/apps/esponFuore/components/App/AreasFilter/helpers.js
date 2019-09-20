import Select from "../../../state/Select";
import _ from "lodash";

function getActiveAttributeData(state) {
	let attributeKey = Select.attributes.getActiveKey(state);
	let scopeKey = Select.scopes.getActiveKey(state);
	let periodKeys = Select.periods.getActiveKeys(state);

	// Get relations
	let relations = periodKeys.map(periodKey => {
		return Select.attributeRelations.getFiltered(state, {attributeKey, scopeKey, periodKey});
	});

	if (relations && relations.length) {
		relations = _.flatten(relations);

		// Get data
		let data = {};
		_.forEach(relations, relation => {
			let periodKey = relation.periodKey;
			let dataSourceKey = relation.attributeDataSourceKey;
			let fidColumnName = relation.fidColumnName;
			let dataSource = Select.attributeDataSources.getByKey(state, dataSourceKey);
			let columnName = dataSource && dataSource.data && dataSource.data.columnName;
			let attributeData = Select.attributeData.getByKey(state, dataSourceKey);
			if (attributeData && fidColumnName && columnName) {
				data[periodKey] = attributeData.attributeData.features.map(feature => {
					return {
						key: feature.properties[fidColumnName],
						value: feature.properties[columnName]
					}
				});
			}
		});

		if (data && !_.isEmpty(data)) {
			return data;
		} else {
			return null;
		}

	} else {
		return null;
	}
}

function getActiveAttributeStatistics(state) {
	let attributeKey = Select.attributes.getActiveKey(state);
	let scopeKey = Select.scopes.getActiveKey(state);
	let periodKeys = Select.periods.getActiveKeys(state);

	// Get relations
	let relations = periodKeys.map(periodKey => {
		return Select.attributeRelations.getFiltered(state, {attributeKey, scopeKey, periodKey});
	});

	if (relations && relations.length) {
		relations = _.flatten(relations);

		// Get statistics
		let statistics = [];
		_.forEach(relations, relation => {
			let dataSourceKey = relation.attributeDataSourceKey;
			let statistic = Select.attributeStatistics.getByKey(state, dataSourceKey);
			if (statistic) {
				statistics.push(statistic);
			}
		});

		if (statistics.length) {
			return mergeStatistics(statistics);
		} else {
			return null;
		}

	} else {
		return null;
	}
}

function mergeStatistics(data) {
	if (data.length === 1) {
		return data[0].attributeStatistic;
	} else {
		let min = Number.POSITIVE_INFINITY;
		let max = Number.NEGATIVE_INFINITY;

		_.forEach(data, item => {
			let statistic = item.attributeStatistic;
			if (statistic.min < min) {
				min = statistic.min;
			}

			if (statistic.max > max) {
				max = statistic.max;
			}
		});

		return {min, max};
	}
}

export default {
	getActiveAttributeData,
	getActiveAttributeStatistics
}