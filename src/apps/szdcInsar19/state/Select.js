import {createSelector} from 'reselect';
import _ from 'lodash';

import CommonSelect from '../../../state/Select';
import CacheFifo from "../../../utils/CacheFifo";

let trackTimeSerieChartCache = new CacheFifo(10);

const getActiveViewConfigurationPeriod = createSelector(
	[
		(state) => CommonSelect.app.getConfiguration(state, 'track.views'),
		(state) => CommonSelect.components.get(state, 'szdcInsar19_App', 'activeAppView')
	],
	(views, activeView) => {
		if (views && activeView) {
			const [category, viewKey] = activeView.split('.');
			const view = views[viewKey];
			return view && view.period;
		} else {
			return null;
		}
	}
);

const getLayersForLegendByMapKey = createSelector(
	[
		CommonSelect.maps.getLayersStateByMapKey,
		CommonSelect.styles.getAllAsObject,
		CommonSelect.attributes.getAllAsObject
	],
	(layers, styles, attributes) => {
		if (layers && !_.isEmpty(styles) && !_.isEmpty(attributes)) {
			let layersForLegend = [];

			layers.forEach(layer => {
				if (layer.styleKey) {
					let layerForLegend = {
						key: layer.key,
						name: layer.name,
						style: styles[layer.styleKey]
					};

					if (layer.attributeKeys) {
						layerForLegend.attributes = {};
						layer.attributeKeys.forEach(key => {
							layerForLegend.attributes[key] = attributes[key];
						});
					}

					layersForLegend.push(layerForLegend);
				}
			});

			return layersForLegend.length ? layersForLegend : null;
		} else {
			return null;
		}
	}
);

// TODO
const getTrackTimeSerieChartFilter = createSelector(
	[
		CommonSelect.app.getCompleteConfiguration,
		(state) => CommonSelect.maps.getMapLayersByMapKey(state, 'szdcInsar19'),
		CommonSelect.selections.getActiveKey,
	],
		(config, layers, activeSelectionKey) => {
			let areaTreeLevelKey = null;
			if (layers && activeSelectionKey) {
				const selectedLayer = _.find(layers, layer => {return layer && layer.options && layer.options.selected && layer.options.selected.hasOwnProperty(activeSelectionKey)});
				if (selectedLayer) {
					areaTreeLevelKey = selectedLayer.areaTreeLevelKey;
				}
			}

			let trackConfiguration = config && config.track;

			if (areaTreeLevelKey && trackConfiguration) {
				return {
					areaTreeLevelKey,
					attributeKey: trackConfiguration.dAttribute
				};
			} else {
				return null;
			}
		}
);

const getDataForTrackTimeSerieChart = (state) => {
	const filter = getTrackTimeSerieChartFilter(state);

	if (filter) {
		const dataSources = CommonSelect.attributeDataSources.getFilteredDataSources(state, filter);

		if (dataSources) {
			const activeBigPeriodKey = CommonSelect.components.get(state, 'szdcInsar19_App', 'activePeriod') || CommonSelect.app.getConfiguration(state, 'basePeriod');
			const basePeriodKey = CommonSelect.app.getConfiguration(state, 'basePeriod');
			
			const activePeriod = CommonSelect.periods.getByKey(state, activeBigPeriodKey);
			const basePeriod = CommonSelect.periods.getByKey(state, basePeriodKey);
			
			const startTime = activePeriod && activePeriod.data && activePeriod.data.start;
			const endTime = activePeriod && activePeriod.data && activePeriod.data.end;
			const baseStartTime = basePeriod && basePeriod.data && basePeriod.data.start;
			const baseEndTime = basePeriod && basePeriod.data && basePeriod.data.end;
			
			const periodsByActive = CommonSelect.periods.getByFullPeriodAsObject(state, startTime, endTime);
			const periodsByBase = CommonSelect.periods.getByFullPeriodAsObject(state, baseStartTime, baseEndTime);

			let cacheKey = JSON.stringify(filter);
			let cache = trackTimeSerieChartCache.findByKey(cacheKey);

			// return cached values if following data did not change
			if (cache
				&& cache.filter === filter
				&& cache.dataSources === dataSources
				&& cache.periodsByBase === periodsByBase
			) {
				return cache.dataForChart;
			}

			else {
				let timeSerie = [];
				let pointId = null;
				_.each(dataSources, ds => {
					let properties = ds.dataSource && ds.dataSource.data && ds.dataSource.data.features && ds.dataSource.data.features[0] && ds.dataSource.data.features[0].properties; // TODO more features?
					if (properties) {
						if (!pointId) {
							pointId = properties[ds.fidColumnName]
						}

						let period = periodsByBase[ds.periodKey];
						let isInActivePeriod = !!periodsByActive[ds.periodKey];

						if (period) {
							let point = {
								name: pointId,
								period: period.data.start,
								value: properties[ds.attributeKey]
							};

							if (isInActivePeriod) {
								point.color = "#195dd1"
							} else {
								point.color = "#888"
							}

							point.key = `${pointId}_${period.data.start}_${point.color}`;
							timeSerie.push(point);
						}
					}
				});

				// TODO
				let dataForChart = (timeSerie && timeSerie.length) ? timeSerie : null;

				trackTimeSerieChartCache.addOrUpdate({
					cacheKey,
					filter,
					dataSources,
					periodsByBase,
					dataForChart
				});

				return dataForChart
			}
		} else {
			return null;
		}
	} else {
		return null;
	}
};


let lastAppView = null; //let's call this caching
const szdcInsar19 = {

	// TODO
	getTrackTimeSerieChartFilter,
	getDataForTrackTimeSerieChart,
	getLayersForLegendByMapKey,
	getActiveViewConfigurationPeriod


	// probably obsolete
	// getLayers: state => {
	//
	// 	//get active view, abort on same as last time or none
	// 	let activeAppView = CommonSelect.components.get(state, 'szdcInsar19_App', 'activeAppView');
	// 	if (!activeAppView || activeAppView === lastAppView) return null;
	//
	// 	//initialize, load configuration for active view or abort
	// 	let layers;
	// 	let [activeCategory, activeView] = activeAppView.split('.');
	// 	let configuration = CommonSelect.app.getConfiguration(state, activeCategory + '.views.' + activeView);
	// 	if (!configuration) return null;
	//
	// 	//save active view if we got this far
	// 	lastAppView = activeAppView;
	//
	// 	if (activeCategory === "track") {
	//
	// 		let trackAreaTrees = CommonSelect.app.getConfiguration(state, 'track.areaTrees');
	// 		let areaTreesAndLevels = CommonSelect.app.getConfiguration(state, 'areaTreesAndLevels');
	//
	// 		//find active tracks
	// 		let activeTrackKeys = ["a34ed54f-c9ef-429b-a86e-11f1f20c94be"];
	// 		//add a layer for each
	// 		layers = activeTrackKeys.map(activeTrackKey => {
	// 			return {
	// 				key: `szdcInsar19_${activeCategory}_${activeView}_${activeTrackKey}`,
	// 				areaTreeLevelKey: areaTreesAndLevels[activeTrackKey],
	// 				styleKey: configuration.style[areaTreesAndLevels[activeTrackKey]],
	// 				attributeKeys: configuration.attributes || [configuration.attribute]
	// 			};
	// 		});
	// 	}
	//
	// 	layers = CommonSelect.maps.getLayers(state, layers); // todo fix first
	//
	// 	return layers;
	//
	// }

};

export default {
	...CommonSelect,
	specific: {
		szdcInsar19
	}
}