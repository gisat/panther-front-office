import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";

import presentation from './presentation';

const layers = [
	{
		layerTemplateKey: "szdcInsar19_track_totalDisplacement_5b145ea8-d38d-4955-838a-efc3498eb5fb",
		period: {
			start: "2015-06-01 12:00",
			end: "2015-08-02"
		},
		color: 'rgba(255, 0, 0, 0.7)',
		activeColor: 'rgba(255, 0, 100, 0.5)',
		active: false,
		title: 'Ortofoto 2016',
		info: 'západ',
		zIndex: 3,
	},
	{
		layerTemplateKey: "yyyyy11",
		period: [
			{
				start: "2015-06-01 12:00",
				end: "2015-06-01 12:00"
			},
			{
				start: "2015-06-01 14:00",
				end: "2015-06-01 14:00"
			},
			{
				start: "2015-08-01 14:00",
				end: "2015-08-01 14:00"
			},
		],
		color: 'rgba(0, 237, 3, 0.7)',
		activeColor: 'rgba(0, 200, 100, 0.5)',
		active: true,
		activePeriodIndex: 2, 
		title: 'Sentinel',
		zIndex: 2,
	}
];


const periodLimit = {
	start: '2010',
	end: '2025'
};

const mapStateToProps = (state, ownProps) => {
	return {
		layers: layers,
		periodLimit: periodLimit,
		dates: Select.specific.lpisChangeDates.getDatesForActiveCase(state),
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onMount: () => {
			dispatch(Action.specific.lpisChangeDates.ensureDatesForActiveCase());
		},
		onLayerClick: (layers) => {
			console.log('onLayerClick', layers);
			
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
