import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

const mapStateToProps = (state, props) => {
	return {
		data: Select.scopes.getDataByKey(state, props.itemKey),
		editedData: Select.scopes.getEditedDataByKey(state, props.itemKey),
		deletable: Select.scopes.getDeletePermissionByKey(state, props.itemKey),
		editable: Select.scopes.getUpdatePermissionByKey(state, props.itemKey)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'ScopeConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.scopes.useKeys([props.itemKey], componentId));
			},
			onSave: () => {
				dispatch(Action.scopes.saveEdited(props.itemKey))
				// todo linking
			},
			onDelete: (item) => {
				//TODO - confirm before delete
				dispatch(Action.scopes.delete({key: props.itemKey, data: item}));
				dispatch(Action.screens.close('apps', 'apps-scopeConfig'));
			},
			onUnmount: () => {
				dispatch(Action.scopes.useKeysClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.scopes.updateEdited(props.itemKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);