import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";
import presentation from "./presentation";
import utils from "../../../../../utils/utils";

const mapStateToProps = (state, props) => {
	return {
		data: Select.layerTemplates.getAll(state, props.layerTemplateKey) // todo more specific selector
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'LayerTemplateMetadataSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.layerTemplates.useIndexed(null, null, [["nameInternal", "ascending"]], 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.layerTemplates.useIndexedClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);