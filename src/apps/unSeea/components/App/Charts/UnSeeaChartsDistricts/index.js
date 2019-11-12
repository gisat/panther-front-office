import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import wrapper from './presentation';
import observedEcosystemServiceIndicators from './observedEcosystemServiceIndicators';
import observedMonetaryIndicators from './observedMonetaryIndicators';
import {calculateDataStatistics, calculateData} from '../utils';
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
