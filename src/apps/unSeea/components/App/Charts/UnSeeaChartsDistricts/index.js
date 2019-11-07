import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import wrapper from './presentation';
import observedEcosystemServiceIndicators from './observedEcosystemServiceIndicators';
import observedMonetaryIndicators from './observedMonetaryIndicators';
import _ from "lodash";


const useActiveMetadataKeys = {
	scope: false,
	attribute: false,
	period: false
};

const calculateDataStatistics = (data, observedValues) => {
	
	//calculate data statistics
	const observedDataStatistics = observedValues.map(d => ({
		id: d.name,
		min: null,
		max: null
	}))

	data.forEach((d) => {
		for (const [key, value] of Object.entries(d)) {
			const observedValue = observedValues.find(ov => ov.name === key);
			if(observedValue) {
				const statistics = observedDataStatistics.find(s => s.id === key);
				statistics.min = (statistics.min || statistics.min === 0) ? Math.min(statistics.min, value) : value;
				statistics.max = (statistics.max || statistics.max === 0) ? Math.max(statistics.max, value) : value;
			}
		}
	})

	const sumStatistics = {
		min: null,
		max: null,
		// median: null,
		// values: [],
	}

	observedDataStatistics.forEach(s => {
		sumStatistics.min = (sumStatistics.min || sumStatistics.min === 0) ? Math.min(sumStatistics.min, s.min) : s.min;
		sumStatistics.max = (sumStatistics.max || sumStatistics.max === 0) ? Math.max(sumStatistics.max, s.max) : s.max;
		// sumStatistics.values = [...sumStatistics.values, ...s.values];
		// s.median = calculateMedian(s.values);
	});
	// sumStatistics.median = calculateMedian(sumStatistics.values);
	return {
		observedDataStatistics,
		sumStatistics,
	}
}

const calculateData = (data, observedValues, dataStatistics) => {
		// convert absolute numbers to relative
		//TODO -> should be in selector
		const relativeData = data.map((d) => {
			const data = {};
			for (const [key, value] of Object.entries(d)) {
				const observedValue = observedValues.find(ov => ov.name === key);
				if(observedValue) {
					const statistics = dataStatistics.find(s => s.id === key);
					data[key] = {
						relative: 100 * value / statistics.max,
						absolute: value
					}
				} else {
					data[key] = value;
				}
			}
			return data;
		});

		return relativeData;
}


const mapStateToPropsFactory = (initialState, ownProps) => {

	return (state) => {
		let selectedFeatures = Select.selections.getActive(state);
		let selectedAreas = selectedFeatures && selectedFeatures.data ? selectedFeatures.data.values : null;

		let activeMapKey = Select.maps.getActiveMapKey(state);
		let activeMapSetKey = Select.maps.getMapSetByMapKey(state, activeMapKey).key;
		let layersState = Select.maps.getLayersStateByMapKey_deprecated(state, activeMapKey, useActiveMetadataKeys);
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

		const data = layersVectorData[Object.keys(layersVectorData)[0]][0].spatialData.features.map((f) => {
			return f.properties;
		})

		const ecosystemServiceIndicatorsStatistics = calculateDataStatistics(data, observedEcosystemServiceIndicators);
		const monetaryIndicatorsStatistics = calculateDataStatistics(data, observedMonetaryIndicators);
		const ecosystemServiceIndicatorsData = calculateData(data, observedEcosystemServiceIndicators, ecosystemServiceIndicatorsStatistics.observedDataStatistics);
		const monetaryIndicatorsData = calculateData(data, observedMonetaryIndicators, monetaryIndicatorsStatistics.observedDataStatistics);

		return {
			ecosystemServiceIndicatorsData,
			ecosystemServiceIndicatorsStatistics,
			monetaryIndicatorsData,
			monetaryIndicatorsStatistics,
			selectedArea: selectedAreas[0].toString(),
			activeMapSetKey: activeMapSetKey,
			onActiveMapChanged: ownProps.onActiveMapChanged,
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
