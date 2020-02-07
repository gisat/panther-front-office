import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";
import timelineHelper from "../../helpers/timeline";

import presentation from './presentation';

const periodLimit = {
	start: '2016',
	end: '2020'
};

const mapStateToProps = (state, ownProps) => {
	const dates = Select.specific.lpisChangeDates.getDatesForActiveCase(state);
	const activeLayers = Select.components.get(state, 'szifZmenovaRizeni_ActiveLayers', ownProps.mapKey) || [];
	const seninelLayers = Select.app.getLocalConfiguration(state, 'seninelLayers');
	const sentinelGeoserverUrl = Select.app.getLocalConfiguration(state, 'sentinelGeoserverUrl');

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
	const layers = [...timelineHelper.getSentinelLayers(dates, activeSentinel1Index, 10, 'sentinel1', 'Sentinel', sentinelGeoserverUrl, seninelLayers.trueColor), ...timelineHelper.getSentinelLayers(dates, activeSentinel2Index, 11, 'sentinel2', 'Sentinel infračervený', sentinelGeoserverUrl, seninelLayers.infrared), ...timelineHelper.getBaseLayers(baseLayersCfg, activeWmsKey)];
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
