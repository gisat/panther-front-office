import {connect} from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.configurations.getDataByKey(state, props.itemKey),
		editedData: Select.specific.configurations.getEditedDataByKey(state, props.itemKey),

		deletable: Select.specific.configurations.getDeletePermissionByKey(state, props.itemKey),
		editable: Select.specific.configurations.getUpdatePermissionByKey(state, props.itemKey)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'backOffice_ConfigurationConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.specific.configurations.useKeys([props.itemKey], componentId));
			},
			onSave: () => {
				dispatch(Action.specific.configurations.saveEdited(props.itemKey))
				// todo linking
			},
			onDelete: (item) => {
				dispatch(Action.specific.configurations.delete({key: props.itemKey, data: item}));
				dispatch(Action.screens.close('metadata', 'metadata-configurationConfig')); // TODO !!! USE ACTUAL LINEAGE !!!
			},
			onUnmount: () => {
				dispatch(Action.specific.configurations.useKeysClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.specific.configurations.updateEdited(props.itemKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);