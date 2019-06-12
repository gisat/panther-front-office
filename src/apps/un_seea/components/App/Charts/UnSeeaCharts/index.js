import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";
import utils from "../../../../../../utils/utils";
import wrapper from './presentation';
import _ from "lodash";


const useActiveMetadataKeys = {
	scope: false,
	attribute: false,
	period: false
};

const mapStateToPropsFactory = (initialState, ownProps) => {
	let filter = {};
	let namesFilter = {};
	let periodsFilter = {};
	let chartCfg = {};

	return (state) => {
		let chartConfiguation = Select.charts.getChartConfiguration(state, ownProps.chartKey, useActiveMetadataKeys);
		let activeFilter = Select.selections.getActive(state);
		let activeScope = Select.scopes.getActive(state);
		let nameAttributeKey = activeScope && activeScope.data && activeScope.data.configuration && activeScope.data.configuration.areaNameAttributeKey;
		let currentNamesFilter= {scopeKey: activeScope && activeScope.key, attributeKey: nameAttributeKey};
		let scopeKey = Select.scopes.getActiveKey(state);
		let attributeKey = Select.attributes.getActiveKey(state);

		// don't mutate selector input if it is not needed
		if (!_.isEqual(periodsFilter, {scopeKey, attributeKey})){
			periodsFilter = {scopeKey, attributeKey}
		}

		// don't mutate selector input if it is not needed
		if (!_.isEqual(chartCfg,  chartConfiguation)){
			chartCfg = _.cloneDeep(chartConfiguation);
			filter = _.cloneDeep(chartCfg.mergedFilter);
		}

		// don't mutate selector input if it is not needed
		if (!_.isEqual(namesFilter, currentNamesFilter)){
			namesFilter = _.cloneDeep(currentNamesFilter);
		}

		let dataForChart = Select.charts.getDataForChart(state, filter, chartCfg.key);
		let namesForChart = Select.charts.getNamesForChart(state, namesFilter, chartCfg.key);





// 
// NEW
// 
		let layersState = Select.maps.getLayersStateByMapKey(state, 'un_seea', useActiveMetadataKeys);
		let layersData = layersState ? layersState.map(layer => {
			const filter = _.cloneDeep(layer.mergedFilter)
			return {filter, data: layer.layer}
		}) : null;
		let layers = Select.maps.getLayers(state, layersData);
		layers.forEach((l) => {
			if(l.type === 'vector') {
				l.spatialIdKey = "gid"
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

console.log(layersVectorData);


		const data = layersVectorData['lk_un_seea_boundaries-un_seea_boundaries'][0].spatialData.features.map((f) => {
			return f.properties;
		})








		// TODO ensure periods
		return {
			// attribute: Select.attributes.getActive(state),
			data: data,
			// nameData: namesForChart,
			// filter: activeFilter && activeFilter.data,
			// periods: Select.periods.getByKeys(state, filter && filter.periodKey && filter.periodKey.in),
			// availablePeriodKeys: Select.periods.getKeysByAttributeRelations(state, periodsFilter)
		}
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onSelectionClear: () => {
			// TODO clear specific selection
			dispatch(Action.selections.clearActiveSelection());
		},
		onMount: () => {
			dispatch(Action.charts.use(ownProps.chartKey, useActiveMetadataKeys));
		},
		onUnmount: () => {
			dispatch(Action.charts.useClear(ownProps.chartKey));
		}
	}
};

export default connect(mapStateToPropsFactory, mapDispatchToProps)(wrapper);
