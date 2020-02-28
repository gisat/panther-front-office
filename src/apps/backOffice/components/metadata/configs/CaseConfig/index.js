import {connect} from '@gisatcz/ptr-state';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

const mapStateToProps = (state, props) => {
	return {
		data: Select.cases.getDataByKey(state, props.itemKey),
		editedData: Select.cases.getEditedDataByKey(state, props.itemKey),

		deletable: Select.cases.getDeletePermissionByKey(state, props.itemKey),
		editable: Select.cases.getUpdatePermissionByKey(state, props.itemKey)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'backOffice_CaseConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.cases.useKeys([props.itemKey], componentId));
			},
			onSave: () => {
				dispatch(Action.cases.saveEdited(props.itemKey))
				// todo linking
			},
			onDelete: (item) => {
				dispatch(Action.cases.delete({key: props.itemKey, data: item}));
				dispatch(Action.screens.close('metadata', 'metadata-caseConfig')); // TODO !!! USE ACTUAL LINEAGE !!!
			},
			onUnmount: () => {
				dispatch(Action.cases.useKeysClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.cases.updateEdited(props.itemKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);