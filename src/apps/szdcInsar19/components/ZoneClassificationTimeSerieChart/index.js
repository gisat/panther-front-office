import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";
import utils from "../../../../utils/utils";


const mapStateToProps = (state, ownProps) => {
	return {
		activePeriod: Select.periods.getActive(state),
		activeSelection: Select.selections.getActive(state),
		currentAttribute: Select.attributes.getByKey(state, ownProps.currentAttributeKey),
		data: Select.specific.szdcInsar19.getDataForTrackTimeSerieChart(state)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'szdcInsar19_ZoneClassificationTimeSerieChart' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			onPointsChange: (keys) => {
				dispatch(Action.specific.szdcInsar19.zoneClassificationTimeSerieChartUse(componentId, keys));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);