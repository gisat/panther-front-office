import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import wrapper from './presentation';
import observedValues from './observed';
import _ from "lodash";


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
		let layersState = Select.maps.getLayersStateByMapKey(state, 'un_seea_trees', useActiveMetadataKeys);
		let layersData = layersState ? layersState.map(layer => {
			const filter = _.cloneDeep(layer.mergedFilter)
			return {filter, data: layer.layer}
		}) : null;
		let layers = Select.maps.getLayers(state, layersData);
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


		//FIXME-key from context
		const data = layersVectorData['lk_un_seea_trees-un_seea_trees'][0].spatialData.features.map((f) => {
			return f.properties;
		})


		//calculate data statistics
		const dataStatistics = observedValues.map(d => ({
			id: d.name,
			min: null,
			max: null
		}))

		data.forEach((d) => {
			for (const [key, value] of Object.entries(d)) {
				const observedValue = observedValues.find(ov => ov.name === key);
				if(observedValue) {
					const statistics = dataStatistics.find(s => s.id === key);
					statistics.min = (statistics.min || statistics.min === 0) ? Math.min(statistics.min, value) : value;
					statistics.max = (statistics.max || statistics.max === 0) ? Math.max(statistics.max, value) : value;
				}
			}
		})

		const sumStatistics = {
			min: null,
			max: null
		}

		dataStatistics.forEach(s => {
			sumStatistics.min = (sumStatistics.min || sumStatistics.min === 0) ? Math.min(sumStatistics.min, s.min) : s.min;
			sumStatistics.max = (sumStatistics.max || sumStatistics.max === 0) ? Math.max(sumStatistics.max, s.max) : s.max;
		})


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
		}) 

		return {
			statistics: sumStatistics,
			data: relativeData,
			selectedArea: selectedAreas[0]
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