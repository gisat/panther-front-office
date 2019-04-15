import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import presentation from "../../switchers/presentation";
import utils from "../../../../../utils/utils";
import LayerTreesAppsScreen from "../screens/LayerTreesAppsScreen";

const order = null;

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.backOffice.layerTrees.getAllForActiveApp(state, order),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'layerTrees')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'LayerTreesAppsSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.backOffice.layerTrees.useIndexed({application: true}, null, order, 1, 1000, componentId, 'applications'));
			},
			onUnmount: () => {
				dispatch(Action.layersTrees.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('apps', 'apps-layerTreesConfig', 40, 40, LayerTreesAppsScreen, {itemKey: item.key}))
			},
			onAddClick(item) {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.layerTrees.create(itemKey));
				dispatch(Action.screens.addOrUpdate('apps', 'apps-layerTreesConfig', 40, 40, LayerTreesAppsScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);