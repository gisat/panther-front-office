import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import utils from "../../../../../../utils/utils";
import wrapper from './presentation';


const mapStateToProps = (state, ownProps) => {
	let chartConfiguation = Select.charts.getChartConfiguration(state, ownProps.chartKey);

	let data = Select.charts.getDataForChart(state, chartConfiguation.mergedFilter, chartConfiguation);
	let activeFilter = Select.selections.getActive(state);

	let periods = null;
	if (chartConfiguation && chartConfiguation.mergedFilter && chartConfiguation.mergedFilter.periodKey && chartConfiguation.mergedFilter.periodKey.in) {

		// TODO ensure periods
		periods = Select.periods.getByKeys(state, chartConfiguation.mergedFilter.periodKey.in);
	}

	return {
		attribute: Select.attributes.getActive(state),
		data,
		filter: activeFilter && activeFilter.data,
		periods
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onSelectionClear: () => {
			// TODO clear specific selection
			dispatch(Action.selections.clearActiveSelection());
		},
		onMount: () => {
			dispatch(Action.charts.use(ownProps.chartKey));
		},
		onUnmount: () => {
			dispatch(Action.charts.useClear(ownProps.chartKey));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(wrapper);
