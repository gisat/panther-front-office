import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

import Action from  '../../../../state/Action';
import ActionTypes from  '../../../../constants/ActionTypes';

const mockStore = configureMockStore([thunk]);

const INITIAL_STATE = {
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
		debugger
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



	// setMapData,
	// setMapWorldWindNavigator,


		

		// // addMapToSet,
		// it('should dispatch add action', () => {
		// 	const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: []}}}});
		// 	const expectedActions = [{
		// 		type: ActionTypes.MAPS.SET.ADD_MAP,
		// 		setKey: 'set1',
		// 		mapKey: 'map1',
		// 	}];
		// 	store.dispatch(Action.maps.addMapToSet('set1', 'map1'));
		// 	expect(store.getActions()).toEqual(expectedActions);
		// });
		// it('should dispatch ERROR action after try to add to undefined set', () => {
		// 	const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: []}}}});
		// 	const expectedActions = [{
		// 		type: 'ERROR',
		// 	}];
		// 	store.dispatch(Action.maps.addMapToSet('set2', 'map1'));
		// 	expect(store.getActions()).toEqual(expectedActions);
		// });
		// it('should dispatch ERROR action after try to add existing mapKey', () => {
		// 	const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: ['map1']}}}});
		// 	const expectedActions = [{
		// 		type: 'ERROR',
		// 	}];
		// 	store.dispatch(Action.maps.addMapToSet('set1', 'map1'));
		// 	expect(store.getActions()).toEqual(expectedActions);
		// });
		// it('should dispatch remove action removeMapKeyFromSet', () => {
		// 	const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: ['map1']}}}});
		// 	const expectedActions = [{
		// 		type: ActionTypes.MAPS.SET.REMOVE_MAP,
		// 		setKey: 'set1',
		// 		mapKey: 'map1',
		// 	}];
		// 	store.dispatch(Action.maps.removeMapKeyFromSet('set1', 'map1'));
		// 	expect(store.getActions()).toEqual(expectedActions);
		// });
		// it('should dispatch ERROR action after try to remove mapKey from undefined setKey', () => {
		// 	const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: ['map1']}}}});
		// 	const expectedActions = [{
		// 		type: 'ERROR'
		// 	}];
		// 	store.dispatch(Action.maps.removeMapKeyFromSet('set2', 'map1'));
		// 	expect(store.getActions()).toEqual(expectedActions);
		// });
		// it('should dispatch ERROR action after try to remove undefined mapKey', () => {
		// 	const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: ['map1']}}}});
		// 	const expectedActions = [{
		// 		type: 'ERROR'
		// 	}];
		// 	store.dispatch(Action.maps.removeMapKeyFromSet('set1', 'map2'));
		// 	expect(store.getActions()).toEqual(expectedActions);
		// });
		// it('should dispatch setSetWorldWindNavigatorSync action.', () => {
		// 	const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: ['map1']}}}});
		// 	const worldWindNavigator = {
		// 		location: [0, 0]
		// 	}
		// 	const expectedActions = [{
		// 		type: ActionTypes.MAPS.SET.SET_WORLD_WIND_NAVIGATOR,
		// 		setKey: 'set1',
		// 		worldWindNavigator,
		// 	}];
		// 	store.dispatch(Action.maps.setSetWorldWindNavigator('set1', worldWindNavigator));
		// 	expect(store.getActions()).toEqual(expectedActions);
		// });
		// it('should dispatch ERROR action, after try to set WORLD_WIND_NAVIGATOR to undefined set.', () => {
		// 	const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: ['map1']}}}});
		// 	const worldWindNavigator = {
		// 		location: [0, 0]
		// 	}
		// 	const expectedActions = [{
		// 		type: 'ERROR'
		// 	}];
		// 	store.dispatch(Action.maps.setSetWorldWindNavigator('set2', worldWindNavigator));
		// 	expect(store.getActions()).toEqual(expectedActions);
		// });
		// it('should dispatch setSetSync action.', () => {
		// 	const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1'}}}});
		// 	const sync = {
		// 		location: true,
		// 	}
		// 	const expectedActions = [{
		// 		type: ActionTypes.MAPS.SET.SET_SYNC,
		// 		setKey: 'set1',
		// 		sync,
		// 	}];
		// 	store.dispatch(Action.maps.setSetSync('set1', sync));
		// 	expect(store.getActions()).toEqual(expectedActions);
		// });
		// it('should dispatch ERROR action, after try to set SYNC to undefined set.', () => {
		// 	const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1'}}}});
		// 	const sync = {
		// 		location: true,
		// 	}
		// 	const expectedActions = [{
		// 		type: 'ERROR'
		// 	}];
		// 	store.dispatch(Action.maps.setSetSync('set2', sync));
		// 	expect(store.getActions()).toEqual(expectedActions);
		// });
});