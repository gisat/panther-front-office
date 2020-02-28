import {connect} from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

const mapStateToProps = (state, props) => {
	return {
		data: Select.periods.getDataByKey(state, props.itemKey),
		editedData: Select.periods.getEditedDataByKey(state, props.itemKey),

		deletable: Select.periods.getDeletePermissionByKey(state, props.itemKey),
		editable: Select.periods.getUpdatePermissionByKey(state, props.itemKey)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'PeriodConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.periods.useKeys([props.itemKey], componentId));
			},
			onSave: () => {
				dispatch(Action.periods.saveEdited(props.itemKey))
				// todo linking
			},
			onDelete: (item) => {
				dispatch(Action.periods.delete({key: props.itemKey, data: item}));
				dispatch(Action.screens.close('metadata', 'metadata-periodConfig'));
			},
			onUnmount: () => {
				dispatch(Action.periods.useKeysClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.periods.updateEdited(props.itemKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);