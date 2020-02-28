import {connect} from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

const mapStateToProps = (state, props) => {
	return {
		data: Select.views.getDataByKey(state, props.itemKey),
		editedData: Select.views.getEditedDataByKey(state, props.itemKey),

		deletable: Select.views.getDeletePermissionByKey(state, props.itemKey),
		editable: Select.views.getUpdatePermissionByKey(state, props.itemKey)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'ViewConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.views.useKeys([props.itemKey], componentId));
			},
			onSave: () => {
				dispatch(Action.views.saveEdited(props.itemKey))
			},
			onDelete: (item) => {
				dispatch(Action.views.delete({key: props.itemKey, data: item}));
				dispatch(Action.screens.close('metadata', 'metadata-viewConfig'));
			},
			onUnmount: () => {
				dispatch(Action.views.useKeysClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.views.updateEdited(props.itemKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);