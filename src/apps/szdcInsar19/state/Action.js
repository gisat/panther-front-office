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

		//get active view, abort on same
		let activeAppView = CommonSelect.components.get(state, 'szdcInsar19_App', 'activeAppView');
		if (activeAppView === nextAppView) return null;

		//initialize, load configuration for active view or abort
		let layers;
		let [nextCategory, nextView] = nextAppView.split('.');
		let configuration = CommonSelect.app.getConfiguration(state, nextCategory + '.views.' + nextView);
		if (!configuration) return null;

		//save active view if we got this far
		dispatch(CommonAction.components.set('szdcInsar19_App', 'activeAppView', nextAppView));

		if (nextCategory === "track") {

			let trackAreaTrees = CommonSelect.app.getConfiguration(state, 'track.areaTrees');
			let areaTreesAndLevels = CommonSelect.app.getConfiguration(state, 'areaTreesAndLevels');

			//find active tracks
			let activeTrackKeys = ["25893f38-7a34-438c-9ffa-be1413fb85ae"]; //todo

			//add a layer for each
			layers = activeTrackKeys.map(activeTrackKey => {
				return {
					key: `szdcInsar19_${nextCategory}_${nextView}_${activeTrackKey}`,
					areaTreeLevelKey: areaTreesAndLevels[activeTrackKey],
					styleKey: configuration.style[areaTreesAndLevels[activeTrackKey]],
					attributeKeys: configuration.attributes || [configuration.attribute],
					attributeMetadataModifiers: {
						periodKey: "326760b2-dc84-4112-80dc-2430023c5007", //TODO base period
					},
					options: {
						hovered: {
							style: hoveredStyle //TODO
						},
						gidColumn: 'ID'// TODO pass from relations
					}
				};
			});
		}

		dispatch(CommonAction.maps.setMapLayers('szdcInsar19', layers));

	},

	trackTimeSerieChartUse: (componentId, keys) => (dispatch, getState) => {
		if (keys && keys.length) {
			let filter = Select.specific.szdcInsar19.getTrackTimeSerieChartFilter(getState());

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