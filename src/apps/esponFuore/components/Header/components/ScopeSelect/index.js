import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import {utils} from "panther-utils"

import presentation from "./presentation";

const order = [['nameDisplay', 'ascending']];
const filter = {application: true};

const mapStateToProps = (state, ownProps) => {
	return {
		scopeSelectOpen: Select.components.get(state, 'esponFuore_ScopeSelect', 'scopeSelectOpen'),
		scopes: Select.scopes.getIndexed(state, filter, null, order, 1, 20),
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
				dispatch(Action.scopes.useIndexed({application: true}, null, order, 1, 20, componentId));
			},
			onUnmount: () => {
				dispatch(Action.scopes.useIndexedClear(componentId));
			},
			selectScope: (key) => {
				dispatch(Action.attributeRelations.useIndexedClearAll());
				dispatch(Action.spatialRelations.useIndexedClearAll());
				dispatch(Action.charts.setInitial());
				dispatch(Action.maps.setInitial());

				dispatch(Action.scopes.setActiveKey(key));
				dispatch(Action.components.set('esponFuore_ScopeSelect', 'scopeSelectOpen', false));
				dispatch(Action.components.set('esponFuore_IndicatorSelect', 'indicatorSelectOpen', true));
				dispatch(Action.components.set('esponFuore_IndicatorSelect', 'activeCategory', null));
				dispatch(Action.components.set('esponFuore_IndicatorSelect', 'activeIndicator', null));
				dispatch(Action.attributes.setActiveKey(null));
				dispatch(Action.periods.setActiveKeys(null));
				dispatch(Action.views.setActiveKeys(null));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);