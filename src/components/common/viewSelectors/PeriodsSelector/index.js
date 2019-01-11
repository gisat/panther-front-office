import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import utils from "../../../../utils/utils";

import presentation from "./presentation";

const order = [['name', 'descending']];

const mapStateToProps = () => {
	return state => {
		return {
			activeKey: Select.periods.getActiveKey(state),
			activeKeys: Select.periods.getActiveKeys(state),
			activeScope: Select.scopes.getActive(state),
			isInIntroMode: Select.components.isAppInIntroMode(state),
			periods: Select.periods.getAllForActiveScope(state, order)
		}
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'PeriodsSelector_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onChangePeriods: (data) => {
				if (_.isArray(data)){
					dispatch(Action.periods.setActiveKeys(data));
				} else {
					dispatch(Action.periods.setActiveKey(data));
				}
			},
			onScopeChange: (periods) => {
				dispatch(Action.periods.useIndexed(null, {key: {in: periods}}, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.periods.useIndexedClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);