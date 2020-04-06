import CommonAction from '../../../state/Action';
import Select from '../state/Select';
import esponFuoreIndicators from './EsponFuoreIndicators/actions';
import esponFuoreSelections from './EsponFuoreSelections/actions';

const changeAuLevel = (level) =>
	(dispatch, getState) => {
		dispatch(CommonAction.app.setLocalConfiguration("activeAuLevel", level));

		const activeScopeKey = Select.scopes.getActiveKey(getState());
		const activeIndicatorKey = Select.specific.esponFuoreIndicators.getActiveKey(getState());

		dispatch(CommonAction.attributeRelations.useIndexedClearAll());
		dispatch(CommonAction.spatialRelations.useIndexedClearAll());
		dispatch(CommonAction.charts.setInitial());
		dispatch(CommonAction.maps.setInitial());
		dispatch(CommonAction.attributes.setActiveKey(null));
		dispatch(CommonAction.periods.setActiveKeys(null));
		dispatch(CommonAction.views.setActiveKeys(null));

		dispatch(CommonAction.scopes.setActiveKey(activeScopeKey));
		dispatch(esponFuoreIndicators.select(activeIndicatorKey));
	}
;

const esponFuore = {
	changeAuLevel
};

export default {
	...CommonAction,
	specific: {
		esponFuore,
		esponFuoreIndicators,
		esponFuoreSelections
	}
}