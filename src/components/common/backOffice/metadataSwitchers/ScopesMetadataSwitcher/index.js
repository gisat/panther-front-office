import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";
import presentation from "../presentation";
import utils from "../../../../../utils/utils";
import ScopeMetadataScreen from "../../../../../components/common/backOffice/metadataScreens/ScopeMetadataScreen";

const mapStateToProps = (state, props) => {
	return {
		data: Select.scopes.getAll(state, props.itemKey), // todo more specific selector
	}
};

const mapDispatchToPropsFactory = () => {
	const order = [['nameDisplay', 'ascending']];
	const componentId = 'ScopeMetadataSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.scopes.useIndexed(null, null, order, 1, 1000, componentId));
			},
			onUnmount: () => {
				dispatch(Action.scopes.useIndexedClear(componentId));
			},
			onChange(item) {
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-scopeConfig', 40, 40, ScopeMetadataScreen, {itemKey: item.key}))
			},
			onAddClick(item) {
				const itemKey = utils.uuid();
				dispatch(Action.scopes.create(itemKey));
				dispatch(Action.screens.addOrUpdate('metadata', 'metadata-scopeConfig', 40, 40, ScopeMetadataScreen, {itemKey}))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);