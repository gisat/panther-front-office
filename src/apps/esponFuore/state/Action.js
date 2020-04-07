import CommonAction from '../../../state/Action';
import Select from '../state/Select';
import esponFuoreIndicators from './EsponFuoreIndicators/actions';
import esponFuoreSelections from './EsponFuoreSelections/actions';
import chartsActions from "../../../state/Charts/actions";
import periodsActions from "../../../state/Periods/actions";
import mapsActions from "../../../state/Maps/actions";
import viewsActions from "../../../state/Views/actions";
import common from "../../../state/_common/actions";
import ActionTypes from "../../../constants/ActionTypes";
import _ from "lodash";
import utils from "../../../utils/utils";

const changeAuLevel = (level) =>
	(dispatch, getState) => {
		dispatch(CommonAction.app.setLocalConfiguration("activeAuLevel", level));

		const activeScopeKey = Select.scopes.getActiveKey(getState());
		const activeIndicatorKey = Select.specific.esponFuoreIndicators.getActiveKey(getState());

		dispatch(CommonAction.attributeRelations.useIndexedClearAll());
		dispatch(CommonAction.spatialRelations.useIndexedClearAll());
		dispatch(CommonAction.charts.setInitial());
		// dispatch(CommonAction.maps.setInitial());
		dispatch(CommonAction.attributes.setActiveKey(null));
		// dispatch(CommonAction.periods.setActiveKeys(null));
		dispatch(CommonAction.views.setActiveKeys(null));

		dispatch(CommonAction.scopes.setActiveKey(activeScopeKey));
		dispatch(esponFuoreIndicators.select(activeIndicatorKey, true));
		dispatch(applyViewOnLevelChange());
	}
;

const applyViewOnLevelChange = () =>
	(dispatch, getState) => {
		const activeAuLevel = Select.app.getLocalConfiguration(getState(), "activeAuLevel");
		const scopeConfig = Select.scopes.getActiveScopeConfiguration(getState());

		const viewKey = scopeConfig && scopeConfig["auLevel" + activeAuLevel + "ViewKey"];
		const layerTemplateKey = scopeConfig && scopeConfig["auLevel" + activeAuLevel + "LayerTemplateKey"];

		dispatch(viewsActions.setActiveKey(viewKey));

		dispatch(common.ensureKeys(Select.views.getSubstate, 'views', ActionTypes.VIEWS, [viewKey], 'views')).then(() => {
			let data = Select.views.getDataByKey(getState(), viewKey);
			if (data && data.state) {
				dispatch(chartsActions.updateStateFromView(data.state.charts));

				// update only layers and preserve view, number of maps etc.
				dispatch(setLayerTemplateForAllLayers(layerTemplateKey));
			} else {
				dispatch(common.actionGeneralError("Views#apply: View or state of view doesn't exist! View key: " + viewKey));
			}
		}).catch(err => {
			dispatch(common.actionGeneralError("Views#apply: " + err));
		});
};

const setLayerTemplateForAllLayers = (layerTemplateKey) =>
	(dispatch, getState) => {
		const allMaps = Select.maps.getMaps(getState());
		const activeMapSet = Select.maps.getActiveMapSet(getState());

		let newMapKeys = [];
		const newMaps = allMaps.map(map => {
			const newKey = utils.uuid();
			newMapKeys.push(newKey);

			return {
				key: newKey,
				data: {
					...map.data,
					key: newKey,
					layers: [{
						key: utils.uuid(),
						layerTemplate: layerTemplateKey
					}]
				}
			}
		});

		const newMapSets = [{
			...activeMapSet,
			maps: newMapKeys
		}];

		const newMapsAsObject = _.keyBy(newMaps, 'key');
		const newSetsAsObject = _.keyBy(newMapSets, 'key');

		dispatch(mapsActions.updateStateFromView({maps: newMapsAsObject, sets: newSetsAsObject}));
};

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