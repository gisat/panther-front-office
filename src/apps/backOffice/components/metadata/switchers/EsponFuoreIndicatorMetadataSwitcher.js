import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import utils from "../../../../../utils/utils";

import IndicatorMetadataScreen from "../screens/EsponFuoreIndicatorMetadataScreen";
import presentation from "./presentation";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.esponFuoreIndicators.getAllOrdered(state, order),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'esponFuoreIndicators', 'specific')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'IndicatorMetadataSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useIndexed(null, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-esponFuoreIndicatorConfig', 40, 40, IndicatorMetadataScreen, {itemKey: item.key}))
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.esponFuoreIndicators.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-esponFuoreIndicatorConfig', 40, 40, IndicatorMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);