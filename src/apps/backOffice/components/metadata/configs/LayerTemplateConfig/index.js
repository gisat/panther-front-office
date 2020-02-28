import {connect} from '@gisatcz/ptr-state';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

const mapStateToProps = (state, props) => {
	return {
		data: Select.layerTemplates.getDataByKey(state, props.itemKey),
		editedData: Select.layerTemplates.getEditedDataByKey(state, props.itemKey),
		deletable: Select.layerTemplates.getDeletePermissionByKey(state, props.itemKey),
		editable: Select.layerTemplates.getUpdatePermissionByKey(state, props.itemKey)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'LayerTemplateConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.layerTemplates.useKeys([props.itemKey], componentId));
			},
			onSave: () => {
				dispatch(Action.layerTemplates.saveEdited(props.itemKey))
				// todo linking
			},
			onDelete: (item) => {
				//TODO - confirm before delete
				dispatch(Action.layerTemplates.delete({key: props.itemKey, data: item}));
				dispatch(Action.screens.close('metadata', 'metadata-layerTemplateConfig'));
			},
			onUnmount: () => {
				dispatch(Action.layerTemplates.useKeysClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.layerTemplates.updateEdited(props.itemKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);