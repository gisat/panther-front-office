import commonActions from "../../../../state/_common/actions";
import Select from "../../state/Select";
import ActionTypes from "../../../../constants/ActionTypes";
import commonHelpers from "../../../../state/_common/helpers";
import commonSelectors from "../../../../state/_common/selectors";

const DEFAULT_CATEGORY_PATH = "metadata";

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
		useIndexed: useIndexed(Select.attributes.getSubstate, 'attributes', ActionTypes.ATTRIBUTES)
	},
	layerTemplates: {
		useIndexed: useIndexed(Select.layerTemplates.getSubstate, 'layerTemplates', ActionTypes.LAYER_TEMPLATES)
	},
	periods: {
		useIndexed: useIndexed(Select.periods.getSubstate, 'periods', ActionTypes.PERIODS)
	},
	places: {
		useIndexed: useIndexed(Select.places.getSubstate, 'places', ActionTypes.PLACES)
	},
	scopes: {
		useIndexed: useIndexed(Select.scopes.getSubstate, 'scopes', ActionTypes.SCOPES)
	},
	tags: {
		useIndexed: useIndexed(Select.tags.getSubstate, 'tags', ActionTypes.TAGS)
	}
}