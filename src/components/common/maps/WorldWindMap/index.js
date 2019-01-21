import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import presentation from './presentation';
import {backgroundCuzk, backgroundStamen, layersInitial} from './mockData';

const mapStateToProps = (state, props) => {
	return {
		backgroundLayer: backgroundCuzk,
		layers: layersInitial,
		navigator: {
			lookAtLocation: {
				latitude: 50.1,
				longitude: 14.5
			},
			range: 100000,
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
