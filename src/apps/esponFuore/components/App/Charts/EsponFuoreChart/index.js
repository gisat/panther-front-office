import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import utils from "../../../../../../utils/utils";
import wrapper from './presentation';
import _ from "lodash";

const mapStateToPropsFactory = (initialState, ownProps) => {
	let filter = {};
	let namesFilter = {};
	let chartCfg = {};

	return (state) => {
		let chartConfiguation = Select.charts.getChartConfiguration(state, ownProps.chartKey);
		let activeFilter = Select.selections.getActive(state);
		let activeScope = Select.scopes.getActive(state);
		let nameAttributeKey = activeScope && activeScope.data && activeScope.data.configuration && activeScope.data.configuration.areaNameAttributeKey;
		let currentNamesFilter= {scopeKey: activeScope && activeScope.key, attributeKey: nameAttributeKey};

		// don't mutate selector input if it is not needed
		if (!_.isEqual(chartCfg,  chartConfiguation)){
			chartCfg = _.cloneDeep(chartConfiguation);
			filter = _.cloneDeep(chartCfg.mergedFilter);
		}

		// don't mutate selector input if it is not needed
		if (!_.isEqual(namesFilter, currentNamesFilter)){
			namesFilter = _.cloneDeep(currentNamesFilter);
		}

		let dataForChart = Select.charts.getDataForChart(state, filter, chartCfg);
		let namesForChart = Select.charts.getNamesForChart(state, namesFilter, chartCfg.key);

		// TODO ensure periods
		return {
			attribute: Select.attributes.getActive(state),
			data: dataForChart,
			nameData: namesForChart,
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
