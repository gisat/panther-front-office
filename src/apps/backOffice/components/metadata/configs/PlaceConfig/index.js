import {connect} from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import presentation from "./presentation";
import {utils} from '@gisatcz/ptr-utils'

const mapStateToProps = (state, props) => {
	return {
		data: Select.places.getDataByKey(state, props.itemKey),
		editedData: Select.places.getEditedDataByKey(state, props.itemKey),

		deletable: Select.places.getDeletePermissionByKey(state, props.itemKey),
		editable: Select.places.getUpdatePermissionByKey(state, props.itemKey)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'PlaceConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.places.useKeys([props.itemKey], componentId));
			},
			onSave: () => {
				dispatch(Action.places.saveEdited(props.itemKey))
				// todo linking
			},
			onDelete: (item) => {
				dispatch(Action.places.delete({key: props.itemKey, data: item}));
				dispatch(Action.screens.close('metadata', 'metadata-placeConfig'));
			},
			onUnmount: () => {
				dispatch(Action.places.useKeysClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.places.updateEdited(props.itemKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);