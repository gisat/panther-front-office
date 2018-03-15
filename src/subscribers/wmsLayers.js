import {connect} from 'redux-haiku';
import Action from '../state/Action';

const mapStateToProps = (state, prevState) => {
	const getLayers = (state) =>
		state &&
		state.wmsLayers &&
		state.wmsLayers.data;

	return {
		data: getLayers(state)
	}
};

const mapDispatchToProps = (dispatch) => ({
	addLayers: (layers) => {
		dispatch(Action.wmsLayers.add(layers));
	},
});

// ===============================================
let listenersRegistered = false;

const registerListeners = (props) => {
	if (!listenersRegistered) {
		window.Stores.addListener((event, options) => {
			if (event === 'WMS_LAYERS_LOADED') {
				props.addLayers(options);
			}
		});
		listenersRegistered = true;
	}
};


const mapsSubscriber = (props) => {
	registerListeners(props);
};


export default connect(mapStateToProps, mapDispatchToProps)(mapsSubscriber)