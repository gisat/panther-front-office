import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import presentation from "./presentation";
import {utils} from "panther-utils"

import TagScreen from "../../metadata/screens/TagScreen";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		options: Select.specific.backOffice.tags.getAllForActiveApp(state, order),
		selected: Select.tags.getByKeys(state, props.keys),

		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'tags'),
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'TagsSelect_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onAdd(key) {
				dispatch(Action.specific.backOffice.tags.create(key));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-tagConfig', 40, 40, TagScreen, {itemKey: key}))
			},
			onOpen: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-tagConfig', 40, 40, TagScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.backOffice.tags.useIndexed({application: true}, null, order, 1, 1000, componentId));
				dispatch(Action.tags.useKeys(props.keys, componentId));
			},
			onUnmount: () => {
				dispatch(Action.tags.useIndexedClear(componentId));
				dispatch(Action.tags.useKeysClear(componentId));

			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);