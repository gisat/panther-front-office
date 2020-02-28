import {connect} from '@gisatcz/ptr-state';
import Select from '../../state/Select';
import Action from "../../state/Action";
import {utils} from '@gisatcz/ptr-utils'

import presentation from './MetadataList';
import PlaceMetadataScreen from "../metadata/screens/PlaceScreen";

const mapStateToProps = (state, props) => {
	return {
		models: Select.specific.backOffice.places.getAllForActiveApp(state, null),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'places')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'PlacesList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-placeConfig', 40, 40, PlaceMetadataScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.backOffice.places.useIndexed({application: true}, null, null, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.places.useIndexedClear(componentId));
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.places.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-placeConfig', 40, 40, PlaceMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
