import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from "./presentation";
import utils from "../../../../../../utils/utils";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.esponFuoreIndicators.getDataByKey(state, props.itemKey),
		editedData: Select.specific.esponFuoreIndicators.getEditedDataByKey(state, props.itemKey),

		deletable: Select.specific.esponFuoreIndicators.getDeletePermissionByKey(state, props.itemKey),
		editable: Select.specific.esponFuoreIndicators.getUpdatePermissionByKey(state, props.itemKey),

		attributes: Select.specific.backOffice.attributes.getAllForActiveApp(state, order),
		views: Select.specific.backOffice.views.getAllForActiveApp(state, order)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'EsponFuoreIndicatorMetadataConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.specific.esponFuoreIndicators.useKeys([props.itemKey], componentId));
				dispatch(Action.specific.backOffice.attributes.useIndexed({application: true}, null, order, 1, 1000, componentId));
				dispatch(Action.specific.backOffice.views.useIndexed({application: true}, null, order, 1, 1000, componentId));
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
				dispatch(Action.attributes.useIndexedClear(componentId));
				dispatch(Action.views.useIndexedClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.specific.esponFuoreIndicators.updateEdited(props.itemKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);