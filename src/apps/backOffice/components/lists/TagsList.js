import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import {utils} from "panther-utils"

import presentation from './MetadataList';
import TagScreen from "../metadata/screens/TagScreen";

const mapStateToProps = (state, props) => {
	return {
		models: Select.specific.backOffice.tags.getAllForActiveApp(state, null),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'tags')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'TagsList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-tagConfig', 40, 40, TagScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.backOffice.tags.useIndexed({application: true}, null, null, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.tags.useIndexedClear(componentId));
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
