import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import wrapper from './presentation';
// import observedValues from './observed';
import {calculateDataStatistics, calculateData} from '../utils';
import _ from "lodash";
import observedCondition from './observedCondition';
import observedPhysicalEcosystemServices from './observedPhysicalEcosystemServices';
import observedMonetaryAssetValues from './observedMonetaryAssetValues';


const useActiveMetadataKeys = {
	scope: false,
	attribute: false,
	period: false
};

const mapStateToPropsFactory = (initialState, ownProps) => {

	return (state) => {
		let selectedFeatures = Select.selections.getActive(state);
		let selectedAreas = selectedFeatures && selectedFeatures.data ? selectedFeatures.data.values : null;

		//FIXME - from context
		let layersState = Select.maps.getLayersStateByMapKey_deprecated(state, 'un_seea_trees', useActiveMetadataKeys);
		let layersData = layersState ? layersState.map(layer => {
			const filter = _.cloneDeep(layer.mergedFilter)
			return {filter, data: layer.layer}
		}) : null;
		let layers = Select.maps.getLayers_deprecated(state, layersData);
		layers.forEach((l) => {
			if(l.type === 'vector') {
				l.spatialIdKey = ownProps.spatialIdKey
			}
		})
		let vectorLayers = layers ? layers.filter((layerData) => layerData.type === 'vector') : [];

		let layersVectorData = vectorLayers.reduce((acc, layerData) => {
			if(layerData.spatialRelationsData) {
				const spatialDataSourceFilter = {
					spatialDataSourceKey: layerData.spatialRelationsData.spatialDataSourceKey,
					// fidColumnName: layerData.spatialRelationsData.fidColumnName
				};

				acc[layerData.key] = Select.spatialDataSources.vector.getBatchByFilterOrder(state, spatialDataSourceFilter, null);
				if (acc[layerData.key]) {
					acc[layerData.key]['fidColumnName'] = layerData.spatialRelationsData.fidColumnName;
				}
			}
			return acc
		}, {});


		// //FIXME-key from context
		const data = layersVectorData['lk_un_seea_trees-un_seea_trees'][0].spatialData.features.map((f) => {
			return f.properties;
		})


		// //calculate data statistics
		// const dataStatistics = observedValues.map(d => ({
		// 	id: d.name,
		// 	min: null,
		// 	max: null,
		// 	values: [],
		// 	median: null,
		// }))

		// data.forEach((d) => {
		// 	for (const [key, value] of Object.entries(d)) {
		// 		const observedValue = observedValues.find(ov => ov.name === key);
		// 		if(observedValue) {
		// 			const statistics = dataStatistics.find(s => s.id === key);
		// 			statistics.min = (statistics.min || statistics.min === 0) ? Math.min(statistics.min, value) : value;
		// 			statistics.max = (statistics.max || statistics.max === 0) ? Math.max(statistics.max, value) : value;
		// 			statistics.values.push(value);
		// 		}
		// 	}
		// })

		// const sumStatistics = {
		// 	min: null,
		// 	max: null,
		// 	median: null,
		// 	values: [],
		// }

		// dataStatistics.forEach(s => {
		// 	sumStatistics.min = (sumStatistics.min || sumStatistics.min === 0) ? Math.min(sumStatistics.min, s.min) : s.min;
		// 	sumStatistics.max = (sumStatistics.max || sumStatistics.max === 0) ? Math.max(sumStatistics.max, s.max) : s.max;
		// 	sumStatistics.values = [...sumStatistics.values, ...s.values];
			
		// 	s.median = calculateMedian(s.values);
		// });

		// sumStatistics.median = calculateMedian(sumStatistics.values);


		// // convert absolute numbers to relative
		// //TODO -> should be in selector
		// const relativeData = data.map((d) => {
		// 	const data = {};
		// 	for (const [key, value] of Object.entries(d)) {
		// 		const observedValue = observedValues.find(ov => ov.name === key);
		// 		if(observedValue) {
		// 			const statistics = dataStatistics.find(s => s.id === key);
		// 			data[key] = {
		// 				// relative: 100 * value / statistics.max,
		// 				relative: 100 * value / statistics.median,
		// 				absolute: value
		// 			}
		// 		} else {
		// 			data[key] = value;
		// 		}
		// 	}
		// 	return data;
		// }) 

		const conditionIndicatorsStatistics = calculateDataStatistics(data, observedCondition);
		const physicalEcosystemServicesIndicatorsStatistics = calculateDataStatistics(data, observedPhysicalEcosystemServices);
		const monetaryAssetValuesStatistics = calculateDataStatistics(data, observedMonetaryAssetValues);
		const conditionIndicatorsIndicatorsData = calculateData(data, observedCondition, conditionIndicatorsStatistics.observedDataStatistics);
		const physicalEcosystemServicesIndicatorsData = calculateData(data, observedPhysicalEcosystemServices, physicalEcosystemServicesIndicatorsStatistics.observedDataStatistics);
		const monetaryAssetValuesData = calculateData(data, observedMonetaryAssetValues, monetaryAssetValuesStatistics.observedDataStatistics);

		return {
			// statistics: sumStatistics,
			// data: relativeData,
			conditionIndicatorsStatistics,
			physicalEcosystemServicesIndicatorsStatistics,
			monetaryAssetValuesStatistics,
			conditionIndicatorsIndicatorsData,
			physicalEcosystemServicesIndicatorsData,
			monetaryAssetValuesData,

			selectedArea: selectedAreas[0],
			// maximum: 100 * sumStatistics.max / sumStatistics.median,
			// maximum: 100,
			maximum: 150,
		}
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onMount: () => {
			dispatch(Action.charts.use(ownProps.chartKey, useActiveMetadataKeys));
		},
		onUnmount: () => {
			dispatch(Action.charts.useClear(ownProps.chartKey));
		}
	}
};

export default connect(mapStateToPropsFactory, mapDispatchToProps)(wrapper);
