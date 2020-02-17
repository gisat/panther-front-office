import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import {utils} from "panther-utils"

import presentation from './MetadataList';
import CaseScreen from "../metadata/screens/CaseScreen";

const mapStateToProps = (state, props) => {
	return {
		models: Select.specific.backOffice.cases.getAllForActiveApp(state, null),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'cases')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'CasesList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-caseConfig', 40, 40, CaseScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.backOffice.cases.useIndexed({application: true}, null, null, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.cases.useIndexedClear(componentId));
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
