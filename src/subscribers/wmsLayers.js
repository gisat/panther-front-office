import {connect} from 'redux-haiku';
import Action from '../state/Action';
import utils from '../utils/utils';

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
				props.addLayers(utils.replaceIdWithKey(options));
			}
		});
		listenersRegistered = true;
	}
};

const wmsLayersSubscriber = (props) => {
	registerListeners(props);
};


export default connect(mapStateToProps, mapDispatchToProps)(wmsLayersSubscriber)