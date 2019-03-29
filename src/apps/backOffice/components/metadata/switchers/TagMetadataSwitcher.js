import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import utils from "../../../../../utils/utils";

import TagMetadataScreen from "../screens/TagMetadataScreen";
import presentation from "./presentation";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.backOffice.tags.getAllForActiveApp(state, order)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'TagMetadataSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.backOffice.tags.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.tags.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-tagConfig', 40, 40, TagMetadataScreen, {itemKey: item.key}))
			},
			onAddClick() {
				const itemKey = utils.uuid();
				dispatch(Action.tags.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-tagConfig', 40, 40, TagMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);