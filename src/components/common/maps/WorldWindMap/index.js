import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import presentation from './presentation';
import {backgroundCuzk, backgroundStamen, layersInitial} from './mockData';

const mapStateToProps = (state, props) => {
	return {
		backgroundLayer: backgroundCuzk,
		layers: layersInitial,
		navigator: Select.maps.getMapNavigator(state, props.mapKey)
	}
};

const mapDispatchToProps = (dispatch, props) => {
	return {
		onWorldWindNavigatorChange: (updates) => {
			dispatch(Action.maps.updateWorldWindNavigator(props.mapKey, updates));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
