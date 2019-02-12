import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";
import presentation from "./presentation";
import utils from "../../../../../utils/utils";

const mapStateToProps = (state, props) => {
	return {
		data: Select.layerTemplates.getDataByKey(state, props.layerTemplateKey)
		// todo edited data
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'LayerTemplateMetadataConfig_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onMount: () => {
				dispatch(Action.layerTemplates.useKeys([props.layerTemplateKey], componentId));
			},
			onUnmount: () => {
				dispatch(Action.layerTemplates.useKeysClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);