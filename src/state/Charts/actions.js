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
			dispatch(Action.attributeRelations.ensureIndexedForChart(chart.mergedFilter, null, 1, 1000, componentId));
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