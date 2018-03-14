import {connect, getDiff} from 'redux-haiku';
import Action from '../state/Action';
import _ from 'lodash';

const mapStateToProps = (state, prevState) => {
	const getActiveMapKeySelector = (state) =>
		state &&
		state.maps &&
		state.maps.activeMapKey;

	const getMapDependencyOnPeriod = (state) =>
		state &&
		state.maps &&
		state.maps.independentOfPeriod;

	const getMaps = (state) =>
		state &&
		state.maps &&
		state.maps.data;

	let oldKey = getActiveMapKeySelector(prevState);
	let newKey = getActiveMapKeySelector(state);

	let oldIsIndependent = getMapDependencyOnPeriod(prevState);
	let newIsIndependent = getMapDependencyOnPeriod(state);

	let changed = ((oldKey != newKey) || (state.maps.initialized != prevState.maps.initialized) || (oldIsIndependent != newIsIndependent));

	return changed && {
		activeMapKey: newKey,
		isMapIndependentOfPeriod: newIsIndependent,
		data: getMaps(state)
	};
};

const mapDispatchToProps = (dispatch) => ({
	addMap: (map) => {
		dispatch(Action.maps.add(map));
	},
	handleMapDependencyOnPeriod: (independent) => {
		dispatch(Action.maps.handleMapDependencyOnPeriod(independent));
	},
	removeMap: (map) => {
		dispatch(Action.maps.remove(map));
	},
	setActiveMapKey: (key) => {
		dispatch(Action.maps.setActive(key));
	},
	updateDefaultPeriods: (periods) => {
		dispatch(Action.maps.updateDefaults({periods: periods}))
	},
	updateMaps: (maps) => {
		dispatch(Action.maps.update({data: maps}))
	}
});

// ===============================================

let listenersRegistered = false;
let lastProps;

const registerListeners = (props) => {
	if (!listenersRegistered){
		window.Stores.addListener((event, options) => {
			if (event === 'map#selected'){
				props.setActiveMapKey(options.id);
			} else if (event === 'map#defaultMapUnselected'){
				props.setActiveMapKey(null);
			} else if (event === 'map#added'){
				props.addMap(convertWorldWindMapToMap(options.map));
			} else if (event === 'map#removed'){
				props.removeMap(options.id);
			} else if (event === 'fo#mapIsIndependentOfPeriod'){
				props.handleMapDependencyOnPeriod(true);
			} else if (event === 'fo#mapIsDependentOnPeriod'){
				props.handleMapDependencyOnPeriod(false);
			} else if (event === 'periods#change'){
				if (lastProps.isMapIndependentOfPeriod){
					props.updateDefaultPeriods(options);
				}
			} else if (event === 'periods#initial'){
				if (lastProps.isMapIndependentOfPeriod){
					props.updateDefaultPeriods(options);
				} else {
					let maps = lastProps.data;
					if (options && options.length && maps.length){
						maps[0]['period'] = options[0];
						props.updateMaps(maps);
					}
				}
			}
		});
		listenersRegistered = true;
	}
};

const convertWorldWindMapToMap = (map) => {
	let data = {
		key: map._id,
		name: map._name
	};
	if (map._period && !lastProps.isMapIndependentOfPeriod){
		data['period'] = map._period
	}

	return data;
};

const mapsSubscriber = (props) => {
	lastProps = props;
	registerListeners(props);
};


export default connect(mapStateToProps, mapDispatchToProps)(mapsSubscriber)