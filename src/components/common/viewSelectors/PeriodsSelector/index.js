import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import utils from "../../../../utils/utils";

import presentation from "./presentation";


// TODO is this correct approach?

const mapStateToPropsFactory = () => {
	const componentId = 'PeriodsSelector_' + utils.randomString(6);

	return state => {
		return {
			activeKeys: Select.periods.getActiveKeys(state),
			activeScope: Select.scopes.getActive(state),
			componentId: componentId,
			isInIntroMode: Select.components.isAppInIntroMode(state),
			periods: Select.periods.getAllForIndexInUseByComponentId(state, componentId)
		}
	}
};

const mapDispatchToPropsFactory = () => {
	return (dispatch) => {
		return {
			onChangePeriods: (keys) => {
				dispatch(Action.periods.setActiveKeys(keys));
			},
			onScopeChange: (periods, componentId) => {
				dispatch(Action.periods.useIndexed({key: {in: periods}}, [['name', 'descending']], 1, 1000, componentId));
			}
		}
	}
};

export default connect(mapStateToPropsFactory, mapDispatchToPropsFactory)(presentation);