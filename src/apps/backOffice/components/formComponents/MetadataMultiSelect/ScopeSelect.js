import {connect} from '@gisatcz/ptr-state';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

import ScopeScreen from "../../apps/screens/ScopeScreen";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		options: Select.specific.backOffice.scopes.getAllForActiveApp(state, order),
		selected: Select.scopes.getByKeys(state, props.keys),

		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'scopes'),
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'ScopesSelect_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onAdd(key) {
				dispatch(Action.specific.backOffice.scopes.create(key));
				dispatch(Action.screens.addOrUpdate('apps', 'apps-scopeConfig', 40, 40, ScopeScreen, {itemKey: key}))
			},
			onOpen: (key) => {
				dispatch(Action.screens.addOrUpdate('apps', 'apps-scopeConfig', 40, 40, ScopeScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.backOffice.scopes.useIndexed({application: true}, null, order, 1, 1000, componentId));
				dispatch(Action.scopes.useKeys(props.keys, componentId));
			},
			onUnmount: () => {
				dispatch(Action.scopes.useIndexedClear(componentId));
				dispatch(Action.scopes.useKeysClear(componentId));

			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);