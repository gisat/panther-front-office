import {connect, getDiff} from 'redux-haiku';
import Action from '../state/Action';

const mapStateToProps = (state, prevState) => {
	const getActiveMapKeySelector = (state) =>
		state &&
		state.maps &&
		state.maps.activeMapKey;

	let oldKey = getActiveMapKeySelector(prevState);
	let newKey = getActiveMapKeySelector(state);

	let changed = ((oldKey != newKey) || (state.maps.initialized != prevState.maps.initialized));

	return changed && {
		activeMapKey: newKey
	};
};

const mapDispatchToProps = (dispatch) => ({
	setActiveMapKey: (key) => {
		dispatch(Action.maps.setActive(key));
	}
});

let listenersRegistered = false;
const registerListeners = (props) => {
	if (!listenersRegistered){
		window.Stores.addListener((event, options) => {
			if (event === 'map#selected'){
				props.setActiveMapKey(options.id);
			}
		});
		listenersRegistered = true;
	}
};

const syncNew = (props) => {
	registerListeners(props);
};


export default connect(mapStateToProps, mapDispatchToProps)(syncNew)