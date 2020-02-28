import {connect} from '@gisatcz/ptr-state';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

const mapStateToProps = (state, props) => {
	return {
		data: Select.tags.getDataByKey(state, props.itemKey),
		editedData: Select.tags.getEditedDataByKey(state, props.itemKey),

		deletable: Select.tags.getDeletePermissionByKey(state, props.itemKey),
		editable: Select.tags.getUpdatePermissionByKey(state, props.itemKey)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'TagConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.tags.useKeys([props.itemKey], componentId));
			},
			onSave: () => {
				dispatch(Action.tags.saveEdited(props.itemKey))
			},
			onDelete: (item) => {
				dispatch(Action.tags.delete({key: props.itemKey, data: item}));
				dispatch(Action.screens.close('metadata', 'metadata-tagConfig'));
			},
			onUnmount: () => {
				dispatch(Action.tags.useKeysClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.tags.updateEdited(props.itemKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);