import {connect} from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

import ViewScreen from "../../metadata/screens/ViewScreen";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		options: Select.specific.backOffice.views.getAllForActiveApp(state, order),
		selected: Select.views.getByKeys(state, props.keys),

		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'views'),
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'ViewsSelect_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onAdd(key) {
				dispatch(Action.specific.backOffice.views.create(key));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-viewConfig', 40, 40, ViewScreen, {itemKey: key}))
			},
			onOpen: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-viewConfig', 40, 40, ViewScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.backOffice.views.useIndexed({application: true}, null, order, 1, 1000, componentId));
				dispatch(Action.views.useKeys(props.keys, componentId));
			},
			onUnmount: () => {
				dispatch(Action.views.useIndexedClear(componentId));
				dispatch(Action.views.useKeysClear(componentId));

			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);