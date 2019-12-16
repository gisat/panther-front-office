import CommonAction from '../../../state/Action';
import CommonSelect from "../../../state/Select";
import Select from "./Select";

const hoveredStyle = {
	"rules":[
		{
			"styles": [
				{
					"fill": "#ff00ff"
				}
			]
		}
	]
};

const szdcInsar19 = {

	changeAppView: (nextAppView) => (dispatch, getState) => {

		let state = getState();

		//get active view, abort on same or none
		let activeAppView = CommonSelect.components.get(state, 'szdcInsar19_App', 'activeAppView');
		if (activeAppView === nextAppView || !activeAppView && !nextAppView) return null;

		//use current view as next if not supplied
		if (!nextAppView) nextAppView = activeAppView;

		//initialize, load configuration for active view or abort
		let layers;
		let [nextCategory, nextView] = nextAppView.split('.');
		let configuration = CommonSelect.app.getConfiguration(state, nextCategory + '.views.' + nextView);
		if (!configuration) return null;

		//save active view if we got this far
		dispatch(CommonAction.components.set('szdcInsar19_App', 'activeAppView', nextAppView));

		//get active selection key
		let activeSelectionKey = CommonSelect.selections.getActiveKey(state);

		if (nextCategory === "track") {

			let trackAreaTrees = CommonSelect.app.getConfiguration(state, 'track.areaTrees');
			let areaTreesAndLevels = CommonSelect.app.getConfiguration(state, 'areaTreesAndLevels');

			//find active tracks
			let activeTrackKeys = CommonSelect.components.get(state, 'szdcInsar19_App', 'activeTracks')
				|| CommonSelect.app.getConfiguration(state, 'track.areaTrees') && [CommonSelect.app.getConfiguration(state, 'track.areaTrees')[0]];
			let activePeriodKey = CommonSelect.components.get(state, 'szdcInsar19_App', 'activePeriod') || CommonSelect.app.getConfiguration(state, 'basePeriod');

			if (activeTrackKeys && activePeriodKey) {
				//add a layer for each
				layers = activeTrackKeys.map(activeTrackKey => {
					return {
						key: `szdcInsar19_${nextCategory}_${nextView}_${activeTrackKey}`,
						name: "Track", // TODO add number
						areaTreeLevelKey: areaTreesAndLevels[activeTrackKey],
						styleKey: configuration.style[areaTreesAndLevels[activeTrackKey]],
						attributeKeys: configuration.attributes || [configuration.attribute],
						attributeMetadataModifiers: {
							periodKey: activePeriodKey
						},
						options: {
							selected: activeSelectionKey ? {[activeSelectionKey]: {}} : false,
							hovered: {
								style: hoveredStyle //TODO
							},
							// gidColumn: 'ID'// TODO still needed
						}
					};
				});
			}
		}

		let allLayers = [{
			key: 'cuzk-ortofoto',
			layerTemplateKey: '8caba0b4-9d8e-4b11-a19b-f135edb9f02d'
		},{
			key: 'dem',
			layerTemplateKey: '4d2a48de-d573-4ff1-aea1-39c89fe33818',
			opacity: 0.5
		},{
			key: 'staniceni',
			layerTemplateKey: '17d29801-b5fc-4787-ba3a-8cfe54ec5d45'
		}];


		if (layers) {
			allLayers = [...allLayers, ...layers];
		}

		dispatch(CommonAction.maps.setMapLayers('szdcInsar19', allLayers));
	},

	trackTimeSerieChartUse: (componentId, keys) => (dispatch, getState) => {
		if (keys && keys.length) {
			let filter = Select.specific.szdcInsar19.getTrackTimeSerieChartFilter(getState());

			dispatch(CommonAction.attributes.useKeys([filter.attributeKey], componentId));

			dispatch(CommonAction.attributeRelations.useIndexedRegister(componentId, null, filter, null, 1, 1000));
			dispatch(CommonAction.attributeRelations.ensureIndexed(filter, null, 1, 1000)).then(() => {
				/* Ensure data sources */
				const relations = CommonSelect.attributeRelations.getFiltered(getState(), filter);
				if (relations && relations.length) {
					const dataSourcesKeys = relations.map(relation => relation.attributeDataSourceKey);
					const periodKeys = relations.map(relation => relation.periodKey);

					dispatch(CommonAction.periods.useKeys(periodKeys, componentId));

					dispatch(CommonAction.attributeDataSources.useKeys(dataSourcesKeys, componentId)).then(() => {
						const dataSources = CommonSelect.attributeDataSources.getByKeys(getState(), dataSourcesKeys);
						if (dataSources) {
							let dataSourceKeys = [];
							dataSources.forEach(dataSource => {
								dataSourceKeys.push(dataSource.key);
							});

							// TODO fidColumnName!!!
							const filter = {
								attributeDataSourceKey: {
									in: dataSourceKeys
								},
								fidColumnName: relations[0].fidColumnName,
								fid: {
									in: keys
								}
							};
							dispatch(CommonAction.attributeData.useIndexed(null, filter, null, 1, 1, componentId));

						}
					});
				}
			});
		}
	}
};


export default {
	...CommonAction,
	specific: {
		szdcInsar19
	}
}