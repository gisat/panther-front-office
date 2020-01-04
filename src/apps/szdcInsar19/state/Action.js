import CommonAction from '../../../state/Action';
import CommonSelect from "../../../state/Select";
import Select from "./Select";
import _ from 'lodash';

const hoveredStyle = {
	"rules":[
		{
			"styles": [
				{
					"outlineColor": "#ff00ff",
					"arrowColor": "#ff00ff",
					"outlineWidth": 3,
					// "shadowColor": "#000000",
					// "shadowBlur": 10
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
		
		// clear selection on category change
		if (activeAppView) {
			let [currentCategory, currentView] = activeAppView.split('.');
			if (nextCategory !== currentCategory) {
				//todo clear selection
			}
		}

		//save active view if we got this far
		dispatch(CommonAction.components.set('szdcInsar19_App', 'activeAppView', nextAppView));

		//get active selection key
		let activeSelectionKey = CommonSelect.selections.getActiveKey(state);

		//check selected periods
		if (configuration.period) {
			const periods = CommonSelect.app.getConfiguration(state, 'periods');
			dispatch(CommonAction.components.set('szdcInsar19_App', 'activePeriod', periods[configuration.period]));
		}


		// =================== TRACK =================

		if (nextCategory === "track") {

			let trackAreaTrees = CommonSelect.app.getConfiguration(getState(), 'track.areaTrees');
			let areaTreesAndLevels = CommonSelect.app.getConfiguration(getState(), 'areaTreesAndLevels');

			//find active tracks
			let activeTrackKeys = CommonSelect.components.get(getState(), 'szdcInsar19_App', 'activeTracks') || trackAreaTrees && [trackAreaTrees[0]];
			let activePeriodKey = CommonSelect.components.get(getState(), 'szdcInsar19_App', 'activePeriod') || CommonSelect.app.getConfiguration(getState(), 'basePeriod');

			let areaTrees = CommonSelect.areas.areaTrees.getAllAsObject(getState());

			if (activeTrackKeys && activePeriodKey) {
				//add a layer for each
				layers = activeTrackKeys.map(activeTrackKey => {
					const trackName = areaTrees[activeTrackKey] && areaTrees[activeTrackKey].data.nameInternal;

					return {
						key: `szdcInsar19_${nextCategory}_${nextView}_${activeTrackKey}`,
						name: trackName || "Track",
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

		// =================== ZONE CLASSIFICATION =================

		else if (nextCategory === "zoneClassification") {

			let zoneClassificationAreaTree = CommonSelect.app.getConfiguration(getState(), 'zoneClassification.areaTree');
			let areaTreesAndLevels = CommonSelect.app.getConfiguration(getState(), 'areaTreesAndLevels');
			let activePeriodKey = CommonSelect.components.get(getState(), 'szdcInsar19_App', 'activePeriod') || CommonSelect.app.getConfiguration(getState(), 'basePeriod');

			if (zoneClassificationAreaTree && activePeriodKey) {

				layers = [{
					key: `szdcInsar19_${nextCategory}_${nextView}_${zoneClassificationAreaTree}`,
					name: "Zone Classification",
					areaTreeLevelKey: areaTreesAndLevels[zoneClassificationAreaTree],
					styleKey: configuration.style[areaTreesAndLevels[zoneClassificationAreaTree]],
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
				}];

			}

		}


		// find and add custom layers
		let allLayers = [];

		let activeCustomLayerKeys = CommonSelect.components.get(getState(), 'szdcInsar19_CustomLayers', 'active');
		let customLayersConfiguration = CommonSelect.app.getConfiguration(getState(), 'customLayers');

		if (activeCustomLayerKeys && customLayersConfiguration) {
			let selectedCustomLayers = [];
			customLayersConfiguration.forEach(layer => {
				const {key, data} = layer;
				if (_.includes(activeCustomLayerKeys, key)) {
					selectedCustomLayers.push({...data, key});
				}
			});

			if (selectedCustomLayers.length) {
				allLayers = [...allLayers, ...selectedCustomLayers];
			}
		}

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
	},

	zoneClassificationTimeSerieChartUse: (componentId, keys) => (dispatch, getState) => {
		if (keys && keys.length) {
			let zoneFilter = Select.specific.szdcInsar19.getZoneClassificationSerieChartFilter(getState());

			dispatch(CommonAction.attributes.useKeys(zoneFilter.attributeKey.in, componentId));

			dispatch(CommonAction.attributeRelations.useIndexedRegister(componentId, null, zoneFilter, null, 1, 1000));
			dispatch(CommonAction.attributeRelations.ensureIndexed(zoneFilter, null, 1, 1000)).then(() => {
				/* Ensure data sources */
				const relations = CommonSelect.attributeRelations.getIndexed(getState(), null, zoneFilter, null, 1, 100);
				if (relations && relations.length) {
					const dataSourcesKeys = relations.map(relation => relation.data.attributeDataSourceKey);
					const periodKeys = relations.map(relation => relation.data.periodKey);

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
								fidColumnName: relations[0].data.fidColumnName,
								fid: {
									in: keys
								}
							};
							dispatch(CommonAction.attributeData.useIndexed(null, filter, null, 1, 1, componentId)).then(() => {

								//todo the magic
								const bzzz = CommonSelect.attributeData;

							});

						}
					});
				}
			});
		}
	},

	pointInfoUse: (componentId, keys) => (dispatch, getState) => {
		if (keys && keys.length) {
			let filter = Select.specific.szdcInsar19.getPointInfoFilter(getState());

			dispatch(CommonAction.attributes.useKeys(filter.attributeKey.in, componentId));
			dispatch(CommonAction.attributeRelations.useIndexedRegister(componentId, null, filter, null, 1, 1000));
			dispatch(CommonAction.attributeRelations.ensureIndexed(filter, null, 1, 1000)).then(() => {
				/* Ensure data sources */
				const relations = CommonSelect.attributeRelations.getIndexed(getState(), null, filter, null, 1, 2000);
				if (relations && relations.length) {
					const dataSourcesKeys = relations.map(relation => relation.data.attributeDataSourceKey);

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
								fidColumnName: relations[0].data.fidColumnName,
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