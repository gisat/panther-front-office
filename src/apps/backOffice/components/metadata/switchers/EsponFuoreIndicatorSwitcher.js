import {connect} from '@gisatcz/ptr-state';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import {utils} from '@gisatcz/ptr-utils'

import IndicatorScreen from "../screens/EsponFuoreIndicatorScreen";
import presentation from "../../switchers/presentation";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.esponFuoreIndicators.getAllOrdered(state, order),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'esponFuoreIndicators', 'specific')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'IndicatorSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useIndexed(null, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-esponFuoreIndicatorConfig', 40, 40, IndicatorScreen, {itemKey: item.key}))
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.esponFuoreIndicators.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-esponFuoreIndicatorConfig', 40, 40, IndicatorScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);