import {connect} from '@gisatcz/ptr-state';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

import AttributeMetadataScreen from "../../metadata/screens/AttributeScreen";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		options: Select.specific.backOffice.attributes.getAllForActiveApp(state, order),
		selected: Select.attributes.getByKeys(state, props.keys),

		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'attributes'),
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'AttributesSelect_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onAdd(key) {
				dispatch(Action.specific.backOffice.attributes.create(key));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-attributeConfig', 40, 40, AttributeMetadataScreen, {itemKey: key}))
			},
			onOpen: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-attributeConfig', 40, 40, AttributeMetadataScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.backOffice.attributes.useIndexed({application: true}, null, order, 1, 1000, componentId));
				dispatch(Action.attributes.useKeys(props.keys, componentId));
			},
			onUnmount: () => {
				dispatch(Action.attributes.useIndexedClear(componentId));
				dispatch(Action.attributes.useKeysClear(componentId));

			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);