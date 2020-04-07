import ActionTypes from '../../constants/ActionTypes';

import Select from '../Select';
import Action from '../Action';
import attributeActions from '../../../../state/Attributes/actions';
import layerTemplatesActions from '../../../../state/LayerTemplates/actions';
import viewsActions from '../../../../state/Views/actions';
import common from '../../../../state/_common/actions';

// ============ creators ===========

const setActiveKey = common.setActiveKey(ActionTypes.ESPON_FUORE_INDICATORS);
const create = common.create(Select.specific.esponFuoreIndicators.getSubstate, 'esponFuoreIndicators', ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const deleteItem = common.delete(Select.specific.esponFuoreIndicators.getSubstate, 'esponFuoreIndicators', ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const saveEdited = common.saveEdited(Select.specific.esponFuoreIndicators.getSubstate, 'esponFuoreIndicators', ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const updateEdited = common.updateEdited(Select.specific.esponFuoreIndicators.getSubstate, ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const useKeys = common.useKeys(Select.specific.esponFuoreIndicators.getSubstate, 'esponFuoreIndicators', ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const useKeysClear = common.useKeysClear(ActionTypes.ESPON_FUORE_INDICATORS);
const useIndexedClear = common.useIndexedClear(ActionTypes.ESPON_FUORE_INDICATORS);
const useIndexed = common.useIndexed(Select.specific.esponFuoreIndicators.getSubstate, 'esponFuoreIndicators', ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const refreshUses = common.refreshUses(Select.specific.esponFuoreIndicators.getSubstate, `esponFuoreIndicators`, ActionTypes.ESPON_FUORE_INDICATORS, 'specific');
const ensureIndexesWithFilterByActive = common.ensureIndexesWithFilterByActive(Select.specific.esponFuoreIndicators.getSubstate, 'esponFuoreIndicators', ActionTypes.ESPON_FUORE_INDICATORS, 'specific');

function setActiveAttributeByIndicatorKey(key) {
	return (dispatch, getState) => {
		let indicator = Select.specific.esponFuoreIndicators.getByKey(getState(), key);
		if (indicator && indicator.data && indicator.data.attributeKey) {
			dispatch(attributeActions.setActiveKey(indicator.data.attributeKey));
		}
	}
}

function select(key, levelChange) {
	return (dispatch, getState) => {
		dispatch(setActiveKey(key));
		dispatch(setActiveAttributeByIndicatorKey(key));

		const activeAuLevel = Select.app.getLocalConfiguration(getState(), "activeAuLevel");
		const scopeConfig = Select.scopes.getActiveScopeConfiguration(getState());

		const viewKey = scopeConfig && scopeConfig["auLevel" + activeAuLevel + "ViewKey"];
		const layerTemplateKey = scopeConfig && scopeConfig["auLevel" + activeAuLevel + "LayerTemplateKey"];

		const activeViewKey = Select.views.getActiveKey(getState());
		const activeLayerTemplateKey = Select.layerTemplates.getActiveKey(getState());

		if (!activeLayerTemplateKey || (layerTemplateKey && layerTemplateKey !== activeLayerTemplateKey)) {
			dispatch(layerTemplatesActions.setActiveKey(layerTemplateKey));
		}

		if (!levelChange && (!activeViewKey || (viewKey && viewKey !== activeViewKey))) {
			dispatch(viewsActions.setActiveKey(viewKey));
			dispatch(viewsActions.apply(viewKey, Action));
		}
	}
}

function useIndexedIndicatorsWithAttributes(filterByActive, filter, order, start, length, componentId) {
	return (dispatch, getState) => {
		dispatch(useIndexed(filterByActive, filter, order, start, length, componentId)).then(() => {
			let indicators = Select.specific.esponFuoreIndicators.getIndexed(getState(), filterByActive, filter, order, start, length);
			if (indicators) {
				let attributeKeys = indicators.map(indicator => indicator.data.attributeKey);
				dispatch(attributeActions.useKeys(attributeKeys, componentId));
			}
		});
	}
}

// ============ actions ===========

// ============ export ===========

export default {
	create,
	delete: deleteItem,
	ensureIndexesWithFilterByActive,
	saveEdited,
	updateEdited,
	useKeys,
	useKeysClear,
	refreshUses,
	useIndexed,
	useIndexedIndicatorsWithAttributes,
	useIndexedClear,
	select,
	setActiveKey
}
