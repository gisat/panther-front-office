import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

import Action from  '../../../../state/Action';
import ActionTypes from  '../../../../constants/ActionTypes';

const mockStore = configureMockStore([thunk]);

const INITIAL_STATE = {
	scopes: {},
	places: {},
	periods: {},
	maps: {
		activeSetKey: null,
		activeMapKey: null,
		maps: {},
		sets: {}
	}
};

describe('Maps Maps Actions', () => {
	it('should dispatch addMap action', () => {
		const store = mockStore(INITIAL_STATE);
		const expectedActions = [{
			type: ActionTypes.MAPS.MAP.ADD,
			map: {
				key: 'map1'
			},
		}];
		store.dispatch(Action.maps.addMap({key: 'map1'}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try to add empty map', () => {
		const store = mockStore(INITIAL_STATE);
		const expectedActions = [{
			type: 'ERROR',
		}];
		store.dispatch(Action.maps.addMap({}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try to add map with existing key', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1'
			}
		}}});
		const expectedActions = [{
			type: 'ERROR',
		}];
		store.dispatch(Action.maps.addMap({key: 'map1'}));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should dispatch removeMap action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1'
			}
		}}});
		const expectedActions = [{
			type: ActionTypes.MAPS.MAP.REMOVE,
			mapKey: 'map1'
		}];
		store.dispatch(Action.maps.removeMap('map1'));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should dispatch ERROR action after try to remove non existing mapKey', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1'
			}
		}}});
		const expectedActions = [{type: 'ERROR'}];
		store.dispatch(Action.maps.removeMap('mapXX'));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try to remove non existing mapKey', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {}}});
		const expectedActions = [{type: 'ERROR'}];
		store.dispatch(Action.maps.removeMap('mapXX'));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch setMapName action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1'
			}
		}}});
		const expectedActions = [{
			type: ActionTypes.MAPS.MAP.SET_NAME,
			mapKey: 'map1',
			name: 'Map one'
		}];
		store.dispatch(Action.maps.setMapName('map1', 'Map one'));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch setMapName action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				name: 'map'
			}
		}}});
		const expectedActions = [{
			type: ActionTypes.MAPS.MAP.SET_NAME,
			mapKey: 'map1',
			name: 'Map one'
		}];
		store.dispatch(Action.maps.setMapName('map1', 'Map one'));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try rename undefined map', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				name: 'map'
			}
		}}});
		const expectedActions = [{
			type: 'ERROR'
		}];
		store.dispatch(Action.maps.setMapName('mapXXX', 'Map one'));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch setMapData action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				name: 'map'
			}
		}}});
		const expectedActions = [{
			type: ActionTypes.MAPS.MAP.SET_DATA,
			mapKey: 'map1',
			data: {}
		}];
		store.dispatch(Action.maps.setMapData('map1', {}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch setMapData action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				name: 'map',
				data: {
					test2: 'test2'
				}
			}
		}}});
		const expectedActions = [{
			type: ActionTypes.MAPS.MAP.SET_DATA,
			mapKey: 'map1',
			data: {test1: 'test1'}
		}];
		store.dispatch(Action.maps.setMapData('map1', {test1: 'test1'}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try set data to undefined map', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				name: 'map'
			}
		}}});
		const expectedActions = [{
			type: 'ERROR'
		}];
		store.dispatch(Action.maps.setMapData('mapXXX', {}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch setMapWorldWindNavigator action.', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				name: 'map'
			}
		}}});
		const expectedActions = [{
			type: ActionTypes.MAPS.MAP.WORLD_WIND_NAVIGATOR.SET,
			mapKey: 'map1',
			worldWindNavigator: {
				lookAtLocation: {
					latitude: 11,
					longitude: 12
				},
			}
		}];
		store.dispatch(Action.maps.deprecated_setMapWorldWindNavigator('map1', {
			lookAtLocation: {
				latitude: 11,
				longitude: 12
			},
		}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try to set WWD on undefined mapKey.', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				name: 'map'
			}
		}}});
		const expectedActions = [{
			type: 'ERROR',
		}];
		store.dispatch(Action.maps.deprecated_setMapWorldWindNavigator('mapXX', {
			lookAtLocation: {
				latitude: 11,
				longitude: 12
			},
		}));
		expect(store.getActions()).toEqual(expectedActions);
	});
});