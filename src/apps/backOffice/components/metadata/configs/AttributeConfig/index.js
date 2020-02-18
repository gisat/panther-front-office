import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

const mapStateToProps = (state, props) => {
	return {
		data: Select.attributes.getDataByKey(state, props.itemKey),
		editedData: Select.attributes.getEditedDataByKey(state, props.itemKey),

		deletable: Select.attributes.getDeletePermissionByKey(state, props.itemKey),
		editable: Select.attributes.getUpdatePermissionByKey(state, props.itemKey)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'AttributeConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.attributes.useKeys([props.itemKey], componentId));
			},
			onSave: () => {
				dispatch(Action.attributes.saveEdited(props.itemKey))
				// todo linking
			},
			onDelete: (item) => {
				dispatch(Action.attributes.delete({key: props.itemKey, data: item}));
				dispatch(Action.screens.close('metadata', 'metadata-attributeConfig'));
			},
			onUnmount: () => {
				dispatch(Action.attributes.useKeysClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.attributes.updateEdited(props.itemKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);