import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../../../state/Action";

import {cloneDeep} from 'lodash';

import wrapper from '../../../../../components/common/maps/Deprecated_MapWrapper';

import utils from '../../../../../utils/utils';

const useActiveMetadataKeys = {
	scope: false,
	attribute: false,
	period: false
};

const mapStateToProps = (state, props) => {

	return (state) => {
		const layersMetadata = {};
		let selectedFeatures = Select.selections.getActive(state);
		let selectedAreas = selectedFeatures && selectedFeatures.data ? selectedFeatures.data.values : null;
		let layersState = Select.maps.getLayersStateByMapKey_deprecated(state, props.mapKey, useActiveMetadataKeys);
		let layersData = layersState ? layersState.map(layer => {
			const filter = cloneDeep(layer.mergedFilter)
			return {filter, data: layer.layer}
		}) : null;
		let layers = Select.maps.getLayers_deprecated(state, layersData);
		layers.forEach((l) => {
			if(l.type === 'vector-circle') {
				l.normalized = false;
			}
			if(l.type === 'vector' || l.type === 'vector-large-point' || l.type === 'vector-circle') {
				l.spatialIdKey = props.activeMapAttributeKey
			}
					if(l.type === 'vector-circle') {
						layersMetadata[l.key] = {attributeDataKey: 'PERIMETER'};
					}
		})
		// let vectorLayers = layers ? layers.filter((layerData) => layerData.type === 'vector') : [];
		let vectorLayers = layers ? layers.filter((layerData) => layerData.type === 'vector' || layerData.type === 'vector-large-point' || layerData.type === 'vector-circle') : [];

		const map = Select.maps.getMapByKey(state, props.mapKey);
		let label = null;

		if(map && map.data && map.data.metadataModifiers && map.data.metadataModifiers.period) {
			const periodKey = map.data.metadataModifiers.period;
			const period = Select.periods.getDataByKey(state, periodKey);
			label = period ? period.nameDisplay : null
		}

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

		return {
			layersTreeLoaded: true,
			activeFilter: null,
			backgroundLayer: [{type:'wikimedia'}],
			layers,
			layersVectorData,
			layersAttributeData: null,
			layersAttributeStatistics: {},
			layersMetadata,
			navigator: Select.maps.getNavigator_deprecated(state, props.mapKey),
			// activeAttributeKey: Select.attributes.getActiveKey(state),
			label: label || null,
			// nameData: vectorLayersNames,
			nameData: null,
			selectedItems: selectedAreas,
		}
	}
};

const mapDispatchToProps = (dispatch, props) => {
	const componentId = 'WorldWindMapSelector_' + utils.randomString(6);

	return {
		onMount: () => {},

		onUnmount: () => {},

		onWorldWindNavigatorChange: (updates) => {
			dispatch(Action.maps.deprecated_updateWorldWindNavigator(props.mapKey, updates));
		},

		setActiveMapKey: () => {
			dispatch(Action.maps.setActiveMapKey(props.mapKey));
		},

		setSelected: (keys) => {
			//prevent deselect
			if(keys && keys.length > 0) {
				dispatch(Action.selections.updateActiveSelection('name', keys, []));
			}
		} 
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(wrapper);
