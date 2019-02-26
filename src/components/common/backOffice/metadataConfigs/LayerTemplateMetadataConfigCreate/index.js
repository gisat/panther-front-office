import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";
import presentation from "./presentation";
import utils from "../../../../../utils/utils";

const mapStateToProps = (state, props) => {
	return {
		data: Select.layerTemplates.getDataByKey(state, props.layerTemplateKey),
		editedData: Select.layerTemplates.getEditedDataByKey(state, props.layerTemplateKey)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'LayerTemplateMetadataConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: (key) => {
				dispatch(Action.layerTemplates.create(props.layerTemplateKey));
			},
			onSave: () => {
				dispatch(Action.layerTemplates.saveEdited(props.layerTemplateKey))
			},
			onDelete: () => {
				//TODO - confirm before delete
				dispatch(Action.layerTemplates.deleteByKey(props.layerTemplateKey))
				dispatch(Action.screens.close('metadata', 'metadata-layerTemplateConfig-add'));
			},
			onUnmount: () => {
				//clear edited
				dispatch(Action.layerTemplates.useKeysClear(componentId));
			},
			updateEdited: (key, value) => {
				dispatch(Action.layerTemplates.updateEdited(props.layerTemplateKey, key, value));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);