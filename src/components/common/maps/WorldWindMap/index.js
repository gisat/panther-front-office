import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	return {
		// backgroundLayer: {
		// 	key: "stamen-uuid",
		// 	data: {
		// 		name: "Stamen terrain",
		// 		type: "wmts",
		// 		url: "http://tile.stamen.com/terrain",
		//
		// 		attribution: null,
		// 		numLevels: null,
		//      	opacity: null,
		// 		prefixes: ["a", "b", "c"]
		// 	}
		// },
		backgroundLayer: {
			key: "ortofoto-uuid",
			data: {
				name: "ČÚZK Ortofoto",
				type: "wms",
				url: "http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx?",
				layerNames: "GR_ORTFOTORGB",

				attribution: null,
				numLevels: 14,
				opacity: 1,
				version: "1.3.0",
				customParams: null
			}
		},
		layers: [],
		navigator: {
			lookAtLocation: {
				latitude: 50,
				longitude: 14
			},
			range: 1000000,
			tilt: 40,
			heading: 0,
			roll: 0
		}
	}
};

const mapDispatchToProps = (dispatch) => {
	return {

	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
