import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import utils from "../../../../../utils/utils";

import ViewMetadataScreen from "../screens/ViewMetadataScreen";
import presentation from "./presentation";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.backOffice.views.getAllForActiveApp(state, order),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'views', 'views')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'ViewMetadataSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.backOffice.views.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.views.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-viewConfig', 40, 40, ViewMetadataScreen, {itemKey: item.key}))
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.views.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-viewConfig', 40, 40, ViewMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);