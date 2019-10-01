import { connect } from 'react-redux';

import Action from '../../../../state/Action';

import presentation from "./presentation";


const mapDispatchToProps = dispatch => {
	return {
		onClick: () => {
			dispatch(Action.attributeRelations.useIndexedClearAll());
			dispatch(Action.spatialRelations.useIndexedClearAll());
			dispatch(Action.charts.setInitial());
			dispatch(Action.maps.setInitial());

			dispatch(Action.scopes.setActiveKey(null));
			dispatch(Action.components.set('esponFuore_ScopeSelect', 'scopeSelectOpen', false));
			dispatch(Action.components.set('esponFuore_IndicatorSelect', 'indicatorSelectOpen', true));
			dispatch(Action.components.set('esponFuore_IndicatorSelect', 'activeCategory', null));
			dispatch(Action.components.set('esponFuore_IndicatorSelect', 'activeIndicator', null));
			dispatch(Action.attributes.setActiveKey(null));
			dispatch(Action.periods.setActiveKeys(null));
			dispatch(Action.views.setActiveKeys(null));
			dispatch(Action.specific.esponFuoreSelections.clearActiveSelection());
		}
	}
};

export default connect(null, mapDispatchToProps)(presentation);