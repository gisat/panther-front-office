import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import utils from "../../../../utils/utils";

import presentation from './MetadataList';
import PlaceMetadataScreen
	from "../../../../components/common/backOffice/metadataScreens/PlaceMetadataScreen";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		models: Select.places.getAllForActiveApp(state, order)
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
				dispatch(Action.places.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.places.useIndexedClear(componentId));
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
