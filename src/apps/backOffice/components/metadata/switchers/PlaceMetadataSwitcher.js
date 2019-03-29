import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import utils from "../../../../../utils/utils";

import PlaceMetadataScreen from "../screens/PlaceMetadataScreen";
import presentation from "./presentation";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.backOffice.places.getAllForActiveApp(state, order)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'PlaceMetadataSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.places.specific.backOffice.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.places.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-placeConfig', 40, 40, PlaceMetadataScreen, {itemKey: item.key}))
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.places.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-placeConfig', 40, 40, PlaceMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);