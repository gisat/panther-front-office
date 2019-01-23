import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import presentation from './presentation';
import {backgroundCuzk, backgroundStamen, layersInitial} from './mockData';

const mapStateToProps = (state, props) => {
	return {
		backgroundLayer: backgroundCuzk,
		layers: layersInitial,
		navigator: Select.maps.getMapInSetNavigator(state, props.mapKey, props.mapSetKey)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {

	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
