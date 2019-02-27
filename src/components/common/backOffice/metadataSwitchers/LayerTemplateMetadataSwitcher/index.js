import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";
import presentation from "./presentation";
import utils from "utils/utils";
import LayerTemplateMetadataScreen from "components/common/backOffice/metadataScreens/LayerTemplateMetadataScreen";

const mapStateToProps = (state, props) => {
	return {
		data: Select.layerTemplates.getAll(state, props.layerTemplateKey), // todo more specific selector
	}
};

const mapDispatchToPropsFactory = () => {
	const order = [['nameDisplay', 'ascending']];
	const componentId = 'LayerTemplateMetadataSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.layerTemplates.useIndexed(null, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.layerTemplates.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-layerTemplateConfig', 40, 40, LayerTemplateMetadataScreen, {layerTemplateKey: item.key}))
			},
			onAddClick(item) {
				const layerTemplateKey = utils.uuid();
				dispatch(Action.layerTemplates.create(layerTemplateKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-layerTemplateConfig', 40, 40, LayerTemplateMetadataScreen, {layerTemplateKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);