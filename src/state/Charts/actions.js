import Select from '../../state/Select';
import Action from "../Action";
import commonActions from "../_common/actions";
import ActionTypes from "../../constants/ActionTypes";

const use = (chartKey) => {
	return (dispatch, getState) => {
		let chart = Select.charts.getChartConfiguration(getState(), chartKey);
		let componentId = 'chart-' + chartKey;

		if (chart) {
			dispatch(Action.attributeRelations.useIndexedRegister( componentId, chart.filterByActive, chart.mergedFilter, null, 1, 1000));
			dispatch(Action.attributeRelations.ensureIndexed(chart.mergedFilter, null, 1, 1000)).then(() => {
				let filteredRelations = Select.attributeRelations.getFilteredRelations(getState(), chart.mergedFilter);
				let dataSources = filteredRelations.map(relation => {
					return {
						fidColumnName: relation.fidColumnName,
						attributeDataSourceKey: relation.attributeDataSourceKey
					}
				});

				dataSources.forEach(source => {
					dispatch(Action.attributeData.loadFilteredData(source, componentId));
				});

			}).catch((err) => {
				dispatch(commonActions.actionGeneralError(err));
			});
		}
	}
};

const useClear = (chartKey) => {
	return (dispatch) => {
		dispatch(commonActions.useIndexedClear(ActionTypes.SPATIAL_RELATIONS)(`chart_${chartKey}`));
	};
};

export default {
	use,
	useClear
}