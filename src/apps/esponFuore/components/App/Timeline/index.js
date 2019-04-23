import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import utils from '../../../../../utils/utils';

import presentation from "./presentation";

const order = [['period', 'ascending']];

const mapStateToProps = (state, ownProps) => {
	return {
		activePeriodKeys: Select.periods.getActiveKeys(state),
		periods: Select.periods.getIndexed(state, {application: true}, null, order, 1, 100)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'esponFuore_Timeline_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			onActivePeriodsChange: (keys) => {
				dispatch(Action.periods.setActiveKeys(keys));
			},
			onMount: () => {
				dispatch(Action.periods.useIndexed({application: true}, null, order, 1, 100, componentId));
			},
			onUnmount: () => {
				dispatch(Action.periods.useIndexedClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);