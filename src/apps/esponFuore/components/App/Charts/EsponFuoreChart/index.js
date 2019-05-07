import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import utils from "../../../../../../utils/utils";
import wrapper from './presentation';


const mapStateToProps = (state, ownProps) => {
	let chartConfiguation = Select.charts.getChartConfiguration(state, ownProps.chartKey);

	return {
		attribute: Select.attributes.getActive(state),
		data: Select.charts.getDataForChart(state, chartConfiguation.mergedFilter, chartConfiguation)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onMount: () => {
			dispatch(Action.charts.use(ownProps.chartKey));
		},

		onUnmount: () => {
			dispatch(Action.charts.useClear(ownProps.chartKey));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(wrapper);
