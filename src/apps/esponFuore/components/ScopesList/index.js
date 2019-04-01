import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../state/Action';
import Select from '../../state/Select';
import utils from '../../../../utils/utils';

import presentation from "./presentation";

const order = [['nameDisplay', 'ascending']];
const filter = {applicationKey: 'esponFuore'};

const mapStateToProps = (state, ownProps) => {
	return {
		scopes: Select.scopes.getByFilterOrder(state, filter, order)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'esponFuore_ScopesList_' + utils.randomString(6);

	return (dispatch, ownProps) => {
		return {
			onMount: () => {
				dispatch(Action.scopes.useIndexed(null, filter, order, 1, 100, componentId));
			},
			onScopeSelect: (scopeKey) => {
				dispatch(Action.scopes.setActiveKey(scopeKey));
			},
			onUnmount: () => {
				dispatch(Action.scopes.useIndexedClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);