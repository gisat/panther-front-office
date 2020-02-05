import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import layersHelpers from "../../../state/helpers/layers";

import presentation from './presentation';
const componentID = 'szifZmenovaRizeni_SentinelExplorer';
const periodLimit = {
	start: '2017',
	end: '2020'
};

const getBaseLayers = (baseLayersCfg = [], activeWmsKey) => {
	return baseLayersCfg.map((layerCfg, index) => {
		return {
			layerTemplateKey: layerCfg.key,
			period: layerCfg.period,
			color: 'rgba(0, 237, 3, 0.7)',
			activeColor: 'rgba(255, 0, 0, 0.5)',
			active: layerCfg.key === activeWmsKey,
			title: layerCfg.title,
			info: layerCfg.info,
			options: {
				type: 'baselayer',
				info: layerCfg.info,
				...layerCfg.options
			},
			zIndex: layerCfg.zIndex,
		}
	})
}

const getSentinelLayers = (dates = [], activeIndex, zIndex, layerTemplateKey, title) => {
	const ownLayers = [];
	ownLayers.push({
		layerTemplateKey,
		period: dates.map((date) => {
			return {
				start: date,
				end: date,
			}
		}),
		color: 'rgba(0, 237, 3, 0.7)',
		activeColor: 'rgba(255, 0, 0, 0.5)',
		active: true,
		title,
		options: {
			activePeriodIndex: activeIndex,
			type: 'sentinel',
			url: 'http://panther.gisat.cz/geoserver/wms',
			layers: 'geonode:szif_sentinel2_2019_12_10_2017,geonode:szif_sentinel2_2019_12_10_2018,geonode:szif_sentinel2_2019_12_10_2019_without_06',
		},
		zIndex,
	})
	return ownLayers
}

const mapStateToProps = (state, ownProps) => {
	// const dates = Select.specific.lpisChangeDates.getDatesForActiveCase(state);
	const activeLayers = Select.components.get(state, componentID, `activeLayers.${ownProps.mapKey}`) || [];
	
	const activeSentinel1Layer = activeLayers.find((layer) => {
		return layer.layerTemplateKey === 'sentinel1' && layer.options.type === 'sentinel'
	});


	const activeSentinel2Layer = activeLayers.find((layer) => {
		return layer.layerTemplateKey === 'sentinel2' && layer.options.type === 'sentinel'
	});

	const activeWmsLayer = activeLayers.find((layer) => {
		return layer.options.type === 'wms'
	});

	const activeSentinel1Index = activeSentinel1Layer ? activeSentinel1Layer.options.periodIndex : null;
	const activeSentinel2Index = activeSentinel2Layer ? activeSentinel2Layer.options.periodIndex : null;
	const activeWmsKey = activeWmsLayer ? activeWmsLayer.key : null;
	const defaultLayers = Select.app.getLocalConfiguration(state, 'defaultLayers');
	const baseLayersCfg = defaultLayers|| [];
	// const layers = [...getSentinelLayers(dates, activeSentinel1Index, 10, 'sentinel1', 'Sentinel'), ...getSentinelLayers(dates, activeSentinel2Index, 11, 'sentinel2', 'Sentinel infračervený'), ...getBaseLayers(baseLayersCfg, activeWmsKey)];
	const layers = [...getBaseLayers(baseLayersCfg, activeWmsKey)];
	return {
		activeLayers,
		layers,
		periodLimit: periodLimit,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onMount: () => {
			// dispatch(Action.specific.lpisChangeDates.ensureDatesForActiveCase());
		},
		onLayerClick: (layer, activeLayers) => {
			const updatedLayers = layersHelpers.getToggledLayers(activeLayers, layer);
			dispatch(Action.components.set(componentID, `activeLayers.${ownProps.mapKey}`, updatedLayers));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
