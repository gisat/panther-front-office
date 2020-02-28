import {connect} from '@gisatcz/ptr-state';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import {utils} from '@gisatcz/ptr-utils'

import TagScreen from "../screens/TagScreen";
import presentation from "../../switchers/presentation";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.backOffice.tags.getAllForActiveApp(state, order),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'tags')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'TagSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.backOffice.tags.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.tags.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-tagConfig', 40, 40, TagScreen, {itemKey: item.key}))
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.tags.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-tagConfig', 40, 40, TagScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);