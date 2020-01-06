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

describe('Maps Sets Actions', () => {
	describe('#add set', () => {
		it('should dispatch ERROR action after try add empty set', () => {
			const store = mockStore(INITIAL_STATE);
			const expectedActions = [{
				type: 'ERROR',
			}];
			store.dispatch(Action.maps.addSet({}));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch add action 1', () => {
			const store = mockStore(INITIAL_STATE);
			const expectedActions = [{
				type: ActionTypes.MAPS.SET.ADD,
				set: {
					key: 'set1'
				},
			}, {
				type: ActionTypes.MAPS.SET_ACTIVE_SET_KEY,
				setKey: "set1",
			}];
			store.dispatch(Action.maps.addSet({key: 'set1'}));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch ERROR action after try to add set with same existing key', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {
				set1: {
					key: 'set1'
				}
			}}});
			const expectedActions = [{
				type: 'ERROR'
			}];
			store.dispatch(Action.maps.addSet({key: 'set1'}));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch remove action', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {
				set11: {
					key: 'set11'
				}
			}}});
			const expectedActions = [{
				type: ActionTypes.MAPS.SET.REMOVE,
				setKey: 'set11'
			}];
			store.dispatch(Action.maps.removeSet('set11'));
			expect(store.getActions()).toEqual(expectedActions);
		});

		it('should dispatch ERROR action after try to remove non existing setKey', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {
				set1: {
					key: 'set1'
				}
			}}});
			const expectedActions = [{type: 'ERROR'}];
			store.dispatch(Action.maps.removeSet('setXX'));
			expect(store.getActions()).toEqual(expectedActions);
		});

		it('should dispatch ERROR action after try to remove non existing setKey on empty sets', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {}}});
			const expectedActions = [{type: 'ERROR'}];
			store.dispatch(Action.maps.removeSet('set1'));
			expect(store.getActions()).toEqual(expectedActions);
		});

		// addMapToSet,
		it('should dispatch add action', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: []}}}});
			const expectedActions = [{
				type: ActionTypes.MAPS.SET.ADD_MAP,
				setKey: 'set1',
				mapKey: 'map1'
			}, {
				type: ActionTypes.MAPS.SET_ACTIVE_MAP_KEY,
				mapKey: 'map1'
			}
			];
			store.dispatch(Action.maps.addMapToSet('set1', 'map1'));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch ERROR action after try to add to undefined set', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: []}}}});
			const expectedActions = [{
				type: 'ERROR',
			}];
			store.dispatch(Action.maps.addMapToSet('set2', 'map1'));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch ERROR action after try to add existing mapKey', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: ['map1']}}}});
			const expectedActions = [{
				type: 'ERROR',
			}];
			store.dispatch(Action.maps.addMapToSet('set1', 'map1'));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch remove action removeMapKeyFromSet', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: ['map1']}}}});
			const expectedActions = [{
				type: ActionTypes.MAPS.SET.REMOVE_MAP,
				setKey: 'set1',
				mapKey: 'map1',
			}];
			store.dispatch(Action.maps.removeMapKeyFromSet('set1', 'map1'));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch ERROR action after try to remove mapKey from undefined setKey', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: ['map1']}}}});
			const expectedActions = [{
				type: 'ERROR'
			}];
			store.dispatch(Action.maps.removeMapKeyFromSet('set2', 'map1'));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch ERROR action after try to remove undefined mapKey', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: ['map1']}}}});
			const expectedActions = [{
				type: 'ERROR'
			}];
			store.dispatch(Action.maps.removeMapKeyFromSet('set1', 'map2'));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch setSetWorldWindNavigatorSync action.', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: ['map1']}}}});
			const worldWindNavigator = {
				location: [0, 0]
			}
			const expectedActions = [{
				type: ActionTypes.MAPS.SET.WORLD_WIND_NAVIGATOR.SET,
				setKey: 'set1',
				worldWindNavigator,
			}];
			store.dispatch(Action.maps.deprecated_setSetWorldWindNavigator('set1', worldWindNavigator));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch ERROR action, after try to set WORLD_WIND_NAVIGATOR to undefined set.', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1',maps: ['map1']}}}});
			const worldWindNavigator = {
				location: [0, 0]
			}
			const expectedActions = [{
				type: 'ERROR'
			}];
			store.dispatch(Action.maps.deprecated_setSetWorldWindNavigator('set2', worldWindNavigator));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch setSetSync action.', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1'}}}});
			const sync = {
				location: true,
			}
			const expectedActions = [{
				type: ActionTypes.MAPS.SET.SET_SYNC,
				setKey: 'set1',
				sync,
			}];
			store.dispatch(Action.maps.setSetSync('set1', sync));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch ERROR action, after try to set SYNC to undefined set.', () => {
			const store = mockStore({...INITIAL_STATE, maps: {sets: {set1: {key:'set1'}}}});
			const sync = {
				location: true,
			}
			const expectedActions = [{
				type: 'ERROR'
			}];
			store.dispatch(Action.maps.setSetSync('set2', sync));
			expect(store.getActions()).toEqual(expectedActions);
		});
	});
});