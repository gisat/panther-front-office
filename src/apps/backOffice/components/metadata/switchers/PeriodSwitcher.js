import {connect} from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import {utils} from '@gisatcz/ptr-utils'

import PeriodScreen from "../screens/PeriodScreen";
import presentation from "../../switchers/presentation";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.backOffice.periods.getAllForActiveApp(state, order),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'periods')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'PeriodSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.backOffice.periods.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.periods.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-periodConfig', 40, 40, PeriodScreen, {itemKey: item.key}))
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.periods.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-periodConfig', 40, 40, PeriodScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);