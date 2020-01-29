import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";

import presentation from './presentation';

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
			options: {
				type: 'baselayer',
				...layerCfg.options
			},
			zIndex: index + 1,
		}
	})
}

const getLayers = (dates = [], activeIndex) => {
	const ownLayers = [];
	ownLayers.push({
		layerTemplateKey: "periods",
		period: dates.map((date) => {
			return {
				start: date,
				end: date,
			}
		}),
		color: 'rgba(0, 237, 3, 0.7)',
		activeColor: 'rgba(255, 0, 0, 0.5)',
		active: true,
		title: 'Sentinel',
		options: {
			activePeriodIndex: activeIndex,
			type: 'sentinel'
		},
		zIndex: 10,
	})
	return ownLayers
}

const mapStateToProps = (state, ownProps) => {
	const dates = Select.specific.lpisChangeDates.getDatesForActiveCase(state);
	const activeLayers = Select.components.get(state, 'szifZmenovaRizeni_ActiveLayers', ownProps.mapKey) || [];
	const activeSentinelLayer = activeLayers.find((layer) => {
		return layer.options.type === 'sentinel'
	});
	const activeWmsLayer = activeLayers.find((layer) => {
		return layer.options.type === 'wms'
	});
	const activeSentinelIndex = activeSentinelLayer ? activeSentinelLayer.options.periodIndex : null;
	const activeWmsKey = activeWmsLayer ? activeWmsLayer.key : null;
	const defaultLayers = Select.app.getLocalConfiguration(state, 'defaultLayers');
	const baseLayersCfg = defaultLayers|| [];
	const layers = [...getLayers(dates, activeSentinelIndex), ...getBaseLayers(baseLayersCfg, activeWmsKey)];
	return {
		layers,
		periodLimit: periodLimit,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onMount: () => {
			dispatch(Action.specific.lpisChangeDates.ensureDatesForActiveCase());
		},
		onLayerClick: (layers) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.toggleLayer(ownProps.mapKey, layers));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
