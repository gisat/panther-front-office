import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import utils from '../../../../../../utils/utils';

import presentation from "./presentation";

const filterByActive = {application: true, scope: true};
let tagKey = null;

let categoryTagKey = null;
let categoryFilter = null;

const mapStateToProps = (state, ownProps) => {
	let activeIndicatorKey = Select.components.get(state, 'esponFuore_IndicatorSelect', 'activeIndicator');
	let activeIndicator = Select.specific.esponFuoreIndicators.getByKey(state, activeIndicatorKey);

	if (categoryTagKey !== ownProps.categoryTagKey){
		categoryFilter = {tagKeys: {includes: [ownProps.categoryTagKey]}};
	}
	categoryTagKey = ownProps.categoryTagKey;


	// don't mutate selector input if it is not needed
	if (!_.isEqual(tagKey,  activeIndicator && activeIndicator.data && activeIndicator.data.tagKeys && activeIndicator.data.tagKeys[0])){
		tagKey =  activeIndicator && activeIndicator.data && activeIndicator.data.tagKeys && activeIndicator.data.tagKeys[0];
	}

	let activeIndicatorCategory = Select.tags.getByKey(state, tagKey);
	return {
		indicatorSelectOpen: Select.components.get(state, 'esponFuore_IndicatorSelect', 'indicatorSelectOpen'),
		searchValue: Select.components.get(state, 'esponFuore_IndicatorSelect', 'searchValue'),
		activeCategoryKey: Select.components.get(state, 'esponFuore_IndicatorSelect', 'activeCategory'),
		categories: Select.specific.esponFuore.getOrderedCategories(state, filterByActive, categoryFilter, null, 1, 100),
		indicators: Select.specific.esponFuoreIndicators.getAll(state),
		activeIndicator,
		activeIndicatorCategory
	}
};

const mapDispatchToPropsFactory = (dispatch, ownProps) => {
	const componentId = 'esponFuore_IndicatorSelect_' + utils.randomString(6);
	let categoryFilter = {tagKeys: {includes: [ownProps.categoryTagKey]}};

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
				dispatch(Action.tags.useIndexed(filterByActive, categoryFilter, null, 1, 100, componentId));
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