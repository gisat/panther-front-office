import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import presentation from "./presentation";
import utils from "../../../../../utils/utils";
import LayerTemplateMetadataScreen from "../screens/LayerTemplateMetadataScreen";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.backOffice.layerTemplates.getAllForActiveApp(state, order),
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'LayerTemplateMetadataSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.backOffice.layerTemplates.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.layerTemplates.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-layerTemplateConfig', 40, 40, LayerTemplateMetadataScreen, {itemKey: item.key}))
			},
			onAddClick(item) {
				const itemKey = utils.uuid();
				dispatch(Action.layerTemplates.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-layerTemplateConfig', 40, 40, LayerTemplateMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);