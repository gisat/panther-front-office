import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import utils from "../../../../utils/utils";

import presentation from './MetadataList';
import User from "../../../../components/common/controls/User";
import LayerTemplateMetadataScreen
	from "../../../../components/common/backOffice/metadataScreens/LayerTemplateMetadataScreen";
import LayerTemplateAddMetadataScreen
	from "components/common/backOffice/metadataScreens/LayerTemplateMetadataScreenCreate";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		models: Select.layerTemplates.getAll(state) //TODO select filtered?
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'LayerTemplatesList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-layerTemplateConfig', 40, 40, LayerTemplateMetadataScreen, {layerTemplateKey: key}))
			},
			onMount: () => {
				dispatch(Action.layerTemplates.useIndexed(null, null, order, 1, 1000, componentId)); // TODO filter?
			},
			onUnmount: () => {
				dispatch(Action.layerTemplates.useIndexedClear(componentId));
			},
			onAddClick(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-layerTemplateConfig-add', 40, 40, LayerTemplateAddMetadataScreen))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
