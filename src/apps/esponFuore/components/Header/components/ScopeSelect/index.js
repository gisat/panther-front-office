import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import utils from '../../../../../../utils/utils';

import presentation from "./presentation";


const mapStateToProps = (state, ownProps) => {
	return {
		scopeSelectOpen: Select.components.get(state, 'esponFuore_ScopeSelect', 'scopeSelectOpen'),
		scopes: Select.scopes.getIndexed(state, {application: true}, null, null, 1, 20),
		activeScope: Select.scopes.getActive(state)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'esponFuore_ScopeSelect_' + utils.randomString(6);

	return dispatch => {
		return {
			openSelect: () => {
				dispatch(Action.components.set('esponFuore_ScopeSelect', 'scopeSelectOpen', true))
			},
			closeSelect: () => {
				dispatch(Action.components.set('esponFuore_ScopeSelect', 'scopeSelectOpen', false))
			},
			onMount: () => {
				// TODO order
				dispatch(Action.scopes.useIndexed({application: true}, null, null, 1, 20, componentId));
			},
			onUnmount: () => {
				dispatch(Action.scopes.useIndexedClear(componentId));
			},
			selectScope: (key) => {
				dispatch(Action.scopes.setActiveKey(key));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);