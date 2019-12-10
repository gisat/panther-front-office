import {createSelector} from 'reselect';
import _ from 'lodash';

import CommonSelect from '../../../state/Select';
import CacheFifo from "../../../utils/CacheFifo";

let trackTimeSerieChartCache = new CacheFifo(10);

// TODO
const getTrackTimeSerieChartFilter = createSelector(
	[
		CommonSelect.app.getCompleteConfiguration
	],
		(config) => {
			let areaTreesAndLevels = config && config.areaTreesAndLevels;
			let trackConfiguration = config && config.track;
			//find active tracks
			let activeTrackKey = "25893f38-7a34-438c-9ffa-be1413fb85ae"; //todo

			if (areaTreesAndLevels && trackConfiguration) {
				return {
					areaTreeLevelKey: areaTreesAndLevels[activeTrackKey],
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
			const activePeriod = CommonSelect.periods.getByKey(state, activeBigPeriodKey);
			const startTime = activePeriod && activePeriod.data && activePeriod.data.start;
			const endTime = activePeriod && activePeriod.data && activePeriod.data.end;
			const periods = CommonSelect.periods.getByFullPeriodAsObject(state, startTime, endTime);

			let cacheKey = JSON.stringify(filter);
			let cache = trackTimeSerieChartCache.findByKey(cacheKey);

			// return cached values if following data did not change
			if (cache
				&& cache.filter === filter
				&& cache.dataSources === dataSources
				&& cache.periods === periods
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
						let period = periods[ds.periodKey];
						if (period) {
							timeSerie.push({
								period: period.data.start,
								value: properties[ds.attributeKey]
							})
						}
					}
				});

				// TODO
				let dataForChart = [{
					key: pointId,
					name: pointId,
					data: timeSerie
				}];

				trackTimeSerieChartCache.addOrUpdate({
					cacheKey,
					filter,
					dataSources,
					periods,
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
	getDataForTrackTimeSerieChart


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