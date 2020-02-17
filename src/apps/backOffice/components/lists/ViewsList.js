import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import {utils} from "panther-utils"

import presentation from './MetadataList';
import ViewScreen
	from "../metadata/screens/ViewScreen";

const mapStateToProps = (state, props) => {
	return {
		// todo order
		models: Select.specific.backOffice.views.getAllForActiveApp(state, null),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'views', 'views')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'ViewsList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-viewConfig', 40, 40, ViewScreen, {itemKey: key}))
			},
			onMount: () => {
				// todo order
				dispatch(Action.specific.backOffice.views.useIndexed({application: true}, null, null, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.views.useIndexedClear(componentId));
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.views.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-viewConfig', 40, 40, ViewScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
