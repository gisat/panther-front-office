import {connect} from '@gisatcz/ptr-state';
import Select from '../../state/Select';
import Action from "../../state/Action";
import {utils} from '@gisatcz/ptr-utils'

import presentation from './MetadataList';
import AttributeMetadataScreen from "../metadata/screens/AttributeScreen";

const mapStateToProps = (state, props) => {
	return {
		models: Select.specific.backOffice.attributes.getAllForActiveApp(state, null),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'attributes')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'AttributesList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-attributeConfig', 40, 40, AttributeMetadataScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.backOffice.attributes.useIndexed({application: true}, null, null, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.attributes.useIndexedClear(componentId));
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.attributes.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-attributeConfig', 40, 40, AttributeMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
