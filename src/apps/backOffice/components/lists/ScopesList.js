import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import utils from "../../../../utils/utils";

import presentation from './MetadataList';

import ScopeMetadataScreen
	from "../../../../components/common/backOffice/metadataScreens/ScopeMetadataScreen";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		models: Select.scopes.getAll(state) //TODO select filtered?
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'ScopesList_' + utils.randomString(6);

	return (dispatch, props) => {
		return {
			onItemClick: (key) => {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-scopeConfig', 40, 40, ScopeMetadataScreen, {itemKey: key}))
			},
			onMount: () => {
				dispatch(Action.scopes.useIndexed(null, null, order, 1, 1000, componentId)); // TODO filter?
			},
			onUnmount: () => {
				dispatch(Action.scopes.useIndexedClear(componentId));
			},
			onAddClick(item) {
				const itemKey = utils.uuid();
				//FIXME - register in index before create?
				//do not reload index with known filter
				dispatch(Action.scopes.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-scopeConfig', 40, 40, ScopeMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);
