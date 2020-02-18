import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import {utils} from '@gisatcz/ptr-utils'

import presentation from './MetadataList';
import PeriodMetadataScreen from "../metadata/screens/PeriodScreen";

const mapStateToProps = (state, props) => {
	return {
		models: Select.specific.backOffice.periods.getAllForActiveApp(state, null),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'periods')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'PeriodsList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-periodConfig', 40, 40, PeriodMetadataScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.backOffice.periods.useIndexed({application: true}, null, null, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.periods.useIndexedClear(componentId));
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.periods.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-periodConfig', 40, 40, PeriodMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
