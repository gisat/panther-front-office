import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import utils from "../../../../../../utils/utils";
import wrapper from '../../../../../../components/common/charts/ChartWrapper/ChartWrapper';


const mapStateToProps = (state, ownProps) => {
	let chartConfiguation = Select.charts.getChartConfiguration(state, ownProps.chartKey);

	return {
		// data: Select.charts.getChartConfiguration(state, ownProps.chartKey)
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
