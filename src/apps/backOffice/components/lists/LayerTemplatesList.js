import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import {utils} from "panther-utils"

import presentation from './MetadataList';
import LayerTemplateScreen from "../metadata/screens/LayerTemplateScreen";

const mapStateToProps = (state, props) => {
	let data = Select.specific.backOffice.layerTemplates.getAllWithOutdatedForActiveApp(state, null);

	return {
		models: data.current,
		outdated: data.outdated,
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'layerTemplates')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'LayerTemplatesList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-layerTemplateConfig', 40, 40, LayerTemplateScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.backOffice.layerTemplates.useIndexed({application: true}, null, null, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.layerTemplates.useIndexedClear(componentId));
			},
			onAddClick(item) {
				const itemKey = utils.uuid();
				dispatch(Action.specific.backOffice.layerTemplates.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-layerTemplateConfig', 40, 40, LayerTemplateScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
