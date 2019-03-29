import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import presentation from "./presentation";
import utils from "../../../../../utils/utils";
import ScopeMetadataScreen from "../screens/ScopeMetadataScreen";

const order = [['nameDisplay', 'ascending']];

const mapStateToProps = (state, props) => {
	return {
		data: Select.specific.backOffice.scopes.getAllForActiveApp(state, order), // todo more specific selector
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'ScopeMetadataSwitcher_' + utils.randomString(6);

	return (dispatch) => {
		return {
			onMount: () => {
				dispatch(Action.specific.backOffice.scopes.useIndexed({application: true}, null, order, 1, 1000, componentId));
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