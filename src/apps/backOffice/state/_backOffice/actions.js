import {commonActions, commonHelpers, commonSelectors} from '@gisatcz/ptr-state';
import Select from "../../state/Select";
import ActionTypes from "../../constants/ActionTypes";

const DEFAULT_CATEGORY_PATH = "metadata";

const create = (getSubstate, dataType, actionTypes, categoryPath = DEFAULT_CATEGORY_PATH) => {
	return (key) => {
		return (dispatch, getState) => {
			let appKey = Select.specific.apps.getActiveKey(getState());
			dispatch(commonActions.create(getSubstate, dataType, actionTypes, categoryPath)(key, appKey));
		}
	}
};

const useIndexed = (getSubstate, dataType, actionTypes, categoryPath = DEFAULT_CATEGORY_PATH) => {
	return (filterByActive, filter, order, start, length, componentId) => {
		return (dispatch, getState) => {
			dispatch(commonActions.useIndexedRegister(actionTypes, componentId, filterByActive, filter, order, start, length));
			let state = getState();
			let fullFilter = commonHelpers.mergeFilters({
				activeApplicationKey: commonSelectors.getActiveKey(state => state.specific.apps)(state),
				activeScopeKey: commonSelectors.getActiveKey(state => state.scopes)(state),
				activePeriodKey: commonSelectors.getActiveKey(state => state.periods)(state),
				activePeriodKeys: commonSelectors.getActiveKeys(state => state.periods)(state),
				activePlaceKey: commonSelectors.getActiveKey(state => state.places)(state),
				activePlaceKeys: commonSelectors.getActiveKeys(state => state.places)(state),
			}, filterByActive, filter);
			return dispatch(commonActions.ensureIndexed(getSubstate, dataType, fullFilter, order, start, length, actionTypes, categoryPath));
		};
	}
};

export default {
	attributes: {
		create: create(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES),
		useIndexed: useIndexed(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES)
	},
	cases: {
		create: create(Select.cases.getSubstate, 'cases', ActionTypes.CASES),
		useIndexed: useIndexed(Select.cases.getSubstate, 'cases', ActionTypes.CASES)
	},
	layerTemplates: {
		create: create(Select.layerTemplates.getSubstate, 'layerTemplates', ActionTypes.LAYER_TEMPLATES),
		useIndexed: useIndexed(Select.layerTemplates.getSubstate, 'layerTemplates', ActionTypes.LAYER_TEMPLATES)
	},
	layerTrees: {
		create: create(Select.layersTrees.getSubstate, 'layerTrees', ActionTypes.LAYERSTREES, 'applications'),
		useIndexed: useIndexed(Select.layersTrees.getSubstate, 'layerTrees', ActionTypes.LAYERSTREES, 'applications')
	},
	periods: {
		create: create(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS),
		useIndexed: useIndexed(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS)
	},
	places: {
		create: create(Select.places.getSubstate, 'places', ActionTypes.PLACES),
		useIndexed: useIndexed(Select.places.getSubstate, 'places', ActionTypes.PLACES)
	},
	scopes: {
		create: create(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES),
		useIndexed: useIndexed(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES)
	},
	tags: {
		create: create(Select.tags.getSubstate, 'tags', ActionTypes.TAGS),
		useIndexed: useIndexed(Select.tags.getSubstate, 'tags', ActionTypes.TAGS)
	},
	views: {
		create: create(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views'),
		useIndexed: useIndexed(Select.views.getSubstate, 'views', ActionTypes.VIEWS, 'views')
	}
}