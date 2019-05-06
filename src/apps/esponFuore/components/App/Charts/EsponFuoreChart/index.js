import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import wrapper from '../../../../../../components/common/charts/ChartWrapper/ChartWrapper';


const mapStateToProps = (state, ownProps) => {
	return {
		// data: Select.charts.getData(state, ownProps.chartKey);
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const componentId = 'EsponFuoreChart_' + utils.randomString(6);

	return {
		onMount: () => {
			// dispatch(Action.charts.use(ownProps.chartKey));
		},

		onUnmount: () => {
			// dispatch(Action.charts.useClear(ownProps.chartKey));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(wrapper);
