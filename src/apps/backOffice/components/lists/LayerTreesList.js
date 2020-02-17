import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import {utils} from "panther-utils"

import presentation from './MetadataList';

import LayerTreesScreen from "../apps/screens/LayerTreesScreen";

const mapStateToProps = (state, props) => {
	return {
		models: Select.specific.backOffice.layerTrees.getAllForActiveApp(state, null),
		enableCreate: Select.users.hasActiveUserPermissionToCreate(state, 'layerTrees')
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'LayerTreesList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('apps', 'apps-layerTreesConfig', 40, 40, LayerTreesScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.specific.backOffice.layerTrees.useIndexed({application: true}, null, null, 1, 1000, componentId)); // TODO filter?
			},
			onUnmount: () => {
				dispatch(Action.layersTrees.useIndexedClear(componentId));
			},
			onAddClick(item) {
				const itemKey = utils.uuid();
				//FIXME - register in index before create?
				//do not reload index with known filter
				dispatch(Action.specific.backOffice.layerTrees.create(itemKey));
				dispatch(Action.screens.addOrUpdate('apps', 'apps-layerTreesConfig', 40, 40, LayerTreesScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
