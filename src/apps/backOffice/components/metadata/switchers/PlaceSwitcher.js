import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import {utils} from "panther-utils"

import PlaceScreen from "../screens/PlaceScreen";
import presentation from "../../switchers/presentation";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.backOffice.places.getAllForActiveApp(state, order),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'places')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'PlaceSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.backOffice.places.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.places.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-placeConfig', 40, 40, PlaceScreen, {itemKey: item.key}))
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.places.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-placeConfig', 40, 40, PlaceScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);