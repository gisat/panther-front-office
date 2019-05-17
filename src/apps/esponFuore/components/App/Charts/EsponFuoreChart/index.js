import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import utils from "../../../../../../utils/utils";
import wrapper from './presentation';


const mapStateToProps = (state, ownProps) => {
	let chartConfiguation = Select.charts.getChartConfiguration(state, ownProps.chartKey);
	let activeFilter = Select.selections.getActive(state);

	// TODO ensure periods
	return {
		attribute: Select.attributes.getActive(state),
		data: Select.charts.getDataForChart(state, chartConfiguation.mergedFilter, chartConfiguation),
		filter: activeFilter && activeFilter.data,
		periods: Select.periods.getByKeys(state, chartConfiguation && chartConfiguation.mergedFilter && chartConfiguation.mergedFilter.periodKey && chartConfiguation.mergedFilter.periodKey.in)
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
