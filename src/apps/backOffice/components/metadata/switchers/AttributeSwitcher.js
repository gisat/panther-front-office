import {connect} from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import {utils} from '@gisatcz/ptr-utils'

import AttributeScreen from "../screens/AttributeScreen";
import presentation from "../../switchers/presentation";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.backOffice.attributes.getAllForActiveApp(state, order),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'attributes')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'AttributeSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.backOffice.attributes.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.attributes.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-attributeConfig', 40, 40, AttributeScreen, {itemKey: item.key}))
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.attributes.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-attributeConfig', 40, 40, AttributeScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);