import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import {utils} from "panther-utils"

import presentation from './MetadataList';
import ConfigurationScreen from "../metadata/screens/ConfigurationScreen";

const mapStateToProps = (state, props) => {
	return {
		models: Select.specific.configurations.getAllForActiveApp(state, null),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'configurations')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'ConfigurationsList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('apps', 'metadata-configurationConfig', 40, 40, ConfigurationScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.configurations.useIndexed({application: true}, null, null, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.specific.configurations.useIndexedClear(componentId));
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
