import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import utils from "../../../../utils/utils";

import presentation from './MetadataList';
import LayerTemplateMetadataScreen
	from "../metadata/screens/LayerTemplateMetadataScreen";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		models: Select.specific.backOffice.layerTemplates.getAllForActiveApp(state, order)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'LayerTemplatesList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-layerTemplateConfig', 40, 40, LayerTemplateMetadataScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.backOffice.layerTemplates.useIndexed({application: true}, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.layerTemplates.useIndexedClear(componentId));
			},
			onAddClick(item) {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.layerTemplates.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-layerTemplateConfig', 40, 40, LayerTemplateMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
