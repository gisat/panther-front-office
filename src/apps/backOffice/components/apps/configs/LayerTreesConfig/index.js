import {connect} from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from "./presentation";
import utils from '@gisatcz/ptr-utils';

const mapStateToProps = (state, props) => {
	return {
		data: Select.layersTrees.getDataByKey(state, props.itemKey),
		editedData: Select.layersTrees.getEditedDataByKey(state, props.itemKey),
		deletable: Select.layersTrees.getDeletePermissionByKey(state, props.itemKey),
		editable: Select.layersTrees.getUpdatePermissionByKey(state, props.itemKey)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'LayerTreesConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.layersTrees.useKeys([props.itemKey], componentId));
			},
			onSave: () => {
				dispatch(Action.layersTrees.saveEdited(props.itemKey))
				// todo linking
			},
			onDelete: (item) => {
				//TODO - confirm before delete
				dispatch(Action.layersTrees.delete({key: props.itemKey, data: item}));
				dispatch(Action.screens.close('apps', 'apps-layerTreesConfig'));
			},
			onUnmount: () => {
				dispatch(Action.layersTrees.useKeysClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.layersTrees.updateEdited(props.itemKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);