import {connect} from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import presentation from "../../switchers/presentation";
import {utils} from '@gisatcz/ptr-utils'
import LayerTreesScreen from "../screens/LayerTreesScreen";

const order = null;

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.backOffice.layerTrees.getAllForActiveApp(state, order),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'layerTrees')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'LayerTreesSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.backOffice.layerTrees.useIndexed({application: true}, null, order, 1, 1000, componentId, 'applications'));
			},
			onUnmount: () => {
				dispatch(Action.layersTrees.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('apps', 'apps-layerTreesConfig', 40, 40, LayerTreesScreen, {itemKey: item.key}))
			},
			onAddClick(item) {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.layerTrees.create(itemKey));
				dispatch(Action.screens.addOrUpdate('apps', 'apps-layerTreesConfig', 40, 40, LayerTreesScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);