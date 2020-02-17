import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import {utils} from "panther-utils"

import ConfigurationScreen from "../screens/ConfigurationScreen";
import presentation from "../../switchers/presentation";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.configurations.getAllForActiveApp(state, order),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'configurations')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'PlaceSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.configurations.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.specific.configurations.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('apps', 'metadata-configurationConfig', 40, 40, ConfigurationScreen, {itemKey: item.key}))
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.configurations.create(itemKey));
				dispatch(Action.screens.addOrUpdate('apps', 'metadata-configurationConfig', 40, 40, ConfigurationScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);