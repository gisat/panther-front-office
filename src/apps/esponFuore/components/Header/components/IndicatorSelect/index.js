import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import utils from '../../../../../../utils/utils';

import presentation from "./presentation";


const mapStateToProps = (state, ownProps) => {
	let activeIndicatorKey = Select.components.get(state, 'esponFuore_IndicatorSelect', 'activeIndicator');
	let activeIndicator = Select.specific.esponFuoreIndicators.getByKey(state, activeIndicatorKey);
	let activeIndicatorCategory = activeIndicator && activeIndicator.data.tagKeys && Select.tags.getByKey(state, activeIndicator.data.tagKeys[0]);
	return {
		indicatorSelectOpen: Select.components.get(state, 'esponFuore_IndicatorSelect', 'indicatorSelectOpen'),
		searchValue: Select.components.get(state, 'esponFuore_IndicatorSelect', 'searchValue'),
		categories: Select.tags.getIndexed(state, {application: true, scope: true}, null, null, 1, 20),
		activeCategoryKey: Select.components.get(state, 'esponFuore_IndicatorSelect', 'activeCategory'),
		indicators: Select.specific.esponFuoreIndicators.getAll(state),
		activeIndicator,
		activeIndicatorCategory
	}
};

const mapDispatchToPropsFactory = (dispatch, ownProps) => {
	const componentId = 'esponFuore_IndicatorSelect_' + utils.randomString(6);

	return dispatch => {
		return {
			openIndicatorSelect: () => {
				dispatch(Action.components.set('esponFuore_IndicatorSelect', 'indicatorSelectOpen', true))
			},
			closeIndicatorSelect: () => {
				dispatch(Action.components.set('esponFuore_IndicatorSelect', 'indicatorSelectOpen', false))
			},
			onChangeSearch: (value) => {
				dispatch(Action.components.set('esponFuore_IndicatorSelect', 'searchValue', value))
			},
			onMount: () => {
				dispatch(Action.tags.useIndexed({application: true, scope: true}, null, null, 1, 20, componentId));
			},
			onUnmount: () => {
				dispatch(Action.tags.useIndexedClear(componentId));
			},
			selectCategory: key => {
				dispatch(Action.components.set('esponFuore_IndicatorSelect', 'activeCategory', key))
			},
			selectIndicator: key => {
				dispatch(Action.specific.esponFuoreIndicators.select(key));
				dispatch(Action.components.set('esponFuore_IndicatorSelect', 'activeIndicator', key));
				dispatch(Action.components.set('esponFuore_IndicatorSelect', 'indicatorSelectOpen', false));
				
				//clear UI after change indicator
				dispatch(Action.windows.remove(ownProps.windowSetKey, 'legend'));

			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);