import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import utils from "../../../../../../utils/utils";
import wrapper from './presentation';
import _ from "lodash";

const useActiveMetadataKeys = {
	scope: true,
	attribute: true,
	period: true
};

const mapStateToPropsFactory = (initialState, ownProps) => {
	let filter = {};
	let namesFilter = {};
	let periodsFilter = {};
	let chartCfg = {};

	return (state) => {
		let chartConfiguation = Select.charts.getChartConfiguration(state, ownProps.chartKey, useActiveMetadataKeys);

		let activeFilter = Select.specific.esponFuoreSelections.getActiveWithFilteredKeys(state);
		let activeScope = Select.scopes.getActive(state);
		let nameAttributeKey = activeScope && activeScope.data && activeScope.data.configuration && activeScope.data.configuration.areaNameAttributeKey;
		let currentNamesFilter= {scopeKey: activeScope && activeScope.key, attributeKey: nameAttributeKey};
		let scopeKey = Select.scopes.getActiveKey(state);
		let attributeKey = Select.attributes.getActiveKey(state);

		// don't mutate selector input if it is not needed
		if (!_.isEqual(periodsFilter, {scopeKey, attributeKey})){
			periodsFilter = {scopeKey, attributeKey}
		}

		// don't mutate selector input if it is not needed
		if (!_.isEqual(chartCfg,  chartConfiguation)){
			chartCfg = _.cloneDeep(chartConfiguation);
			filter = _.cloneDeep(chartCfg.mergedFilter);
		}

		// don't mutate selector input if it is not needed
		if (!_.isEqual(namesFilter, currentNamesFilter)){
			namesFilter = _.cloneDeep(currentNamesFilter);
		}

		let dataForChart = Select.charts.getDataForChart(state, filter, chartCfg.key);
		let namesForChart = Select.charts.getNamesForChart(state, namesFilter, chartCfg.key);

		// TODO ensure periods
		return {
			attribute: Select.attributes.getActive(state),
			data: dataForChart,
			nameData: namesForChart,
			filter: activeFilter && activeFilter.data,
			periods: Select.periods.getByKeys(state, filter && filter.periodKey && filter.periodKey.in),
			availablePeriodKeys: Select.periods.getKeysByAttributeRelations(state, periodsFilter)
		}
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onSelectionClear: (attributeKey) => {
			// TODO clear specific selection
			dispatch(Action.specific.esponFuoreSelections.clearActiveAttributeFilterAndByAttributeKey(attributeKey));
		},
		onMount: () => {
			dispatch(Action.charts.use(ownProps.chartKey, useActiveMetadataKeys));
		},
		onUnmount: () => {
			dispatch(Action.charts.useClear(ownProps.chartKey));
		}
	}
};

export default connect(mapStateToPropsFactory, mapDispatchToProps)(wrapper);
