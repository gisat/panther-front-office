import {connect} from 'redux-haiku';
import Action from '../state/Action';
import utils from '../utils/utils';

const mapStateToProps = (state, prevState) => {
	const getScopes = (state) =>
		state &&
		state.scopes &&
		state.scopes.data;

	return {
		data: getScopes(state)
	}
};

const mapDispatchToProps = (dispatch) => ({
	addScopes: (scopes) => {
		dispatch(Action.scopes.add(scopes));
	},
});

// ===============================================
let listenersRegistered = false;

const registerListeners = (props) => {
	if (!listenersRegistered) {
		window.Stores.addListener((event, options) => {
			if (event === 'SCOPES_LOADED') {
				props.addScopes(utils.replaceIdWithKey(options));
			}
		});
		listenersRegistered = true;
	}
};

const scopesSubscriber = (props) => {
	registerListeners(props);
};


export default connect(mapStateToProps, mapDispatchToProps)(scopesSubscriber)