import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import utils from '../../../../../../utils/utils';

import presentation from "./presentation";


const mapStateToProps = (state, ownProps) => {
	return {
		indicatorSelectOpen: Select.components.get(state, 'esponFuore_IndicatorSelect', 'indicatorSelectOpen'),
		searchValue: Select.components.get(state, 'esponFuore_IndicatorSelect', 'searchValue'),
		categories: Select.tags.getAll(state),
		activeCategory: Select.components.get(state, 'esponFuore_IndicatorSelect', 'activeCategory'),
		indicator: {
			key: utils.uuid(),
			data: {
				nameDisplay: 'Employment in the secondary sector under the current imperial government'
			}
		}
	}
};

const mapDispatchToPropsFactory = () => {
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
				dispatch(Action.tags.useIndexed(null, null, null, 1, 20, componentId))
			},
			onUnmount: () => {
				dispatch(Action.tags.useIndexedClear(componentId))
			},
			selectCategory: key => {
				dispatch(Action.components.set('esponFuore_IndicatorSelect', 'activeCategory', key))
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);