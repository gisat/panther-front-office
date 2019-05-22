import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import utils from "../../../../../../utils/utils";
import wrapper from './presentation';
import _ from "lodash";

const mapStateToPropsFactory = (initialState, ownProps) => {
	let filter = {};
	let chartCfg = {};

	return (state) => {
		let chartConfiguation = Select.charts.getChartConfiguration(state, ownProps.chartKey);
		let activeFilter = Select.selections.getActive(state);

		// don't mutate selector input if it is not needed
		if (!_.isEqual(chartCfg,  chartConfiguation)){
			chartCfg =  chartConfiguation;
			filter =  chartCfg.mergedFilter;
		}

		// TODO ensure periods
		return {
			attribute: Select.attributes.getActive(state),
			data: Select.charts.getDataForChart(state, filter, chartCfg),
			filter: activeFilter && activeFilter.data,
			periods: Select.periods.getByKeys(state, filter && filter.periodKey && filter.periodKey.in)
		}
	};
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

export default connect(mapStateToPropsFactory, mapDispatchToProps)(wrapper);
