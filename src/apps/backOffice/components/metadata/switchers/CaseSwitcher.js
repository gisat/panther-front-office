import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import {utils} from "panther-utils"

import CaseScreen from "../screens/CaseScreen";
import presentation from "../../switchers/presentation";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.backOffice.cases.getAllForActiveApp(state, order),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'cases')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'PlaceSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.backOffice.cases.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.cases.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-caseConfig', 40, 40, CaseScreen, {itemKey: item.key}))
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.cases.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-caseConfig', 40, 40, CaseScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);