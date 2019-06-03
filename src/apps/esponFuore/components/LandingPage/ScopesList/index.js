import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import utils from '../../../../../utils/utils';

import presentation from "./presentation";

const order = [['nameDisplay', 'ascending']];
const filter = {application: true};

const mapStateToProps = (state, ownProps) => {
	return {
		scopes: Select.scopes.getIndexed(state, filter, null, order, 1, 100),
		activeScope: Select.scopes.getActive(state)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'esponFuore_ScopesList_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			onMount: () => {
				dispatch(Action.scopes.useIndexed({application: true}, null, order, 1, 100, componentId));
			},
			onScopeSelect: (scopeKey) => {
				dispatch(Action.scopes.setActiveKey(scopeKey));
				dispatch(Action.components.set('esponFuore_ScopeSelect', 'scopeSelectOpen', false));
				dispatch(Action.components.set('esponFuore_IndicatorSelect', 'indicatorSelectOpen', true));
				dispatch(Action.components.set('esponFuore_IndicatorSelect', 'activeCategory', null));
				dispatch(Action.components.set('esponFuore_IndicatorSelect', 'activeIndicator', null));
				dispatch(Action.attributes.setActiveKey(null));
				dispatch(Action.periods.setActiveKey(null));
				dispatch(Action.selections.clearActiveSelection());
			},
			onUnmount: () => {
				dispatch(Action.scopes.useIndexedClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);