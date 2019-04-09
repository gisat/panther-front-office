import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import utils from "../../../../utils/utils";

import presentation from './MetadataList';

import ScopeMetadataScreen
	from "../metadata/screens/ScopeMetadataScreen";

const mapStateToProps = (state, props) => {
	return {
		models: Select.specific.backOffice.scopes.getAllForActiveApp(state, null),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'scopes')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'ScopesList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-scopeConfig', 40, 40, ScopeMetadataScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.backOffice.scopes.useIndexed({application: true}, null, null, 1, 1000, componentId)); // TODO filter?
			},
			onUnmount: () => {
				dispatch(Action.scopes.useIndexedClear(componentId));
			},
			onAddClick(item) {
				const itemKey = utils.uuid();
				//FIXME - register in index before create?
				//do not reload index with known filter
				dispatch(Action.specific.backOffice.scopes.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-scopeConfig', 40, 40, ScopeMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
