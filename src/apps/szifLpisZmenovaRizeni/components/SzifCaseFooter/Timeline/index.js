import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";

import presentation from './presentation';

const layers = [
	// {
	// 	layerTemplateKey: "szdcInsar19_track_totalDisplacement_5b145ea8-d38d-4955-838a-efc3498eb5fb",
	// 	period: {
	// 		start: "2015-06-01 12:00",
	// 		end: "2015-08-02"
	// 	},
	// 	color: 'rgba(255, 0, 0, 0.7)',
	// 	activeColor: 'rgba(255, 0, 100, 0.5)',
	// 	active: false,
	// 	title: 'Ortofoto 2016',
	// 	info: 'západ',
	// 	zIndex: 3,
	// },
	// {
	// 	layerTemplateKey: "yyyyy11",
	// 	period: [
	// 		{
	// 			start: "2015-06-01 12:00",
	// 			end: "2015-06-01 12:00"
	// 		},
	// 		{
	// 			start: "2015-06-01 14:00",
	// 			end: "2015-06-01 14:00"
	// 		},
	// 		{
	// 			start: "2015-08-01 14:00",
	// 			end: "2015-08-01 14:00"
	// 		},
	// 	],
	// 	color: 'rgba(0, 237, 3, 0.7)',
	// 	activeColor: 'rgba(0, 200, 100, 0.5)',
	// 	active: true,
	// 	activePeriodIndex: 2, 
	// 	title: 'Sentinel',
	// 	zIndex: 2,
	// }
];


const periodLimit = {
	start: '2014',
	end: '2020'
};

const getLayers = (dates = [], activeIndex) => {
	const ownLayers = [...layers];
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
		zIndex: 3,
	})
	return ownLayers
}

const mapStateToProps = (state, ownProps) => {
	const dates = Select.specific.lpisChangeDates.getDatesForActiveCase(state);
	const activeLayers = Select.components.get(state, 'szifZmenovaRizeni_ActiveLayers', ownProps.mapKey) || [];
	const activeSentinelLayer = activeLayers.find((layer) => {
		return layer.options.type === 'sentinel'
	});
	const activeSentinelIndex = activeSentinelLayer ? activeSentinelLayer.options.periodIndex : null;
	return {
		layers: getLayers(dates, activeSentinelIndex),
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
