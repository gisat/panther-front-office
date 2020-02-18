import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import {utils} from '@gisatcz/ptr-utils'

import ScopeScreen from "../screens/ScopeScreen";
import presentation from "../../switchers/presentation";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.backOffice.scopes.getAllForActiveApp(state, order),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'scopes', 'scopes')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'ScopeSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				//todo filter
				dispatch(Action.specific.backOffice.scopes.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.scopes.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('apps', 'apps-scopeConfig', 40, 40, ScopeScreen, {itemKey: item.key}))
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.scopes.create(itemKey));
				dispatch(Action.screens.addOrUpdate('apps', 'apps-scopeConfig', 40, 40, ScopeScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);