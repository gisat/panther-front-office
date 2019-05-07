import Select from '../../state/Select';
import Action from "../Action";

const use = (chartKey) => {
	return (dispatch, getState) => {
		let chart = Select.charts.getChartConfiguration(getState(), chartKey);
		let componentId = 'chart-' + chartKey;

		if (chart) {
			dispatch(Action.attributeRelations.useIndexedRegister( componentId, chart.filterByActive, chart.mergedFilter, null, 1, 1000));
			dispatch(Action.attributeRelations.ensureIndexed(chart.mergedFilter, null, 1, 1000))
		}
	}
};

export default {
	use
}