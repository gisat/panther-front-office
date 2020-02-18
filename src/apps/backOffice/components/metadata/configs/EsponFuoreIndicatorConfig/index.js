import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.esponFuoreIndicators.getDataByKey(state, props.itemKey),
		editedData: Select.specific.esponFuoreIndicators.getEditedDataByKey(state, props.itemKey),

		deletable: Select.specific.esponFuoreIndicators.getDeletePermissionByKey(state, props.itemKey),
		editable: Select.specific.esponFuoreIndicators.getUpdatePermissionByKey(state, props.itemKey),
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'EsponFuoreIndicatorConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useKeys([props.itemKey], componentId));
			},
			onSave: () => {
				dispatch(Action.specific.esponFuoreIndicators.saveEdited(props.itemKey));
			},
			onDelete: (item) => {
				dispatch(Action.specific.esponFuoreIndicators.delete({key: props.itemKey, data: item}));
				dispatch(Action.screens.close('metadata', 'metadata-esponFuoreIndicatorConfig'));
			},
			onUnmount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useKeysClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.specific.esponFuoreIndicators.updateEdited(props.itemKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);