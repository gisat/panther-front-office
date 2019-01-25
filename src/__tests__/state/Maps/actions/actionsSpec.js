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

describe('Maps Actions', () => {
	describe('#setActiveMapKey', () => {
		it('should dispatch setActiveMapKey action', () => {
			const store = mockStore(INITIAL_STATE);

			const expectedActions = [{
				type: 'ERROR'
			}];
			store.dispatch(Action.maps.setActiveMapKey('map1'));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch setActiveMapKey action', () => {
			const store = mockStore({...INITIAL_STATE, maps: {maps: {
				map1: {
					key: 'map1'
				}
			}}});

			const expectedActions = [{
				type: ActionTypes.MAPS.SET_ACTIVE_MAP_KEY,
				mapKey: 'map1',
			}];
			store.dispatch(Action.maps.setActiveMapKey('map1'));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch setMapScope action', () => {
			const store = mockStore({...INITIAL_STATE, maps: {maps: {
				map1: {
					key: 'map1'
				}
			}}});

			const expectedActions = [{
				type: ActionTypes.MAPS.SET_SCOPE,
				mapKey: 'map1',
				scope: 111,
			}];
			store.dispatch(Action.maps.setMapScope('map1', 111));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch ERROR action after try to set scope on undefined map', () => {
			const store = mockStore({...INITIAL_STATE, maps: {maps: {
				map1: {
					key: 'map1'
				}
			}}});

			const expectedActions = [{
				type: 'ERROR',
			}];
			store.dispatch(Action.maps.setMapScope('mapXX', 111));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch setMapScenario action', () => {
			const store = mockStore({...INITIAL_STATE, maps: {maps: {
				map1: {
					key: 'map1'
				}
			}}});

			const expectedActions = [{
				type: ActionTypes.MAPS.SET_SCENARIO,
				mapKey: 'map1',
				scenario: 111,
			}];
			store.dispatch(Action.maps.setMapScenario('map1', 111));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch ERROR action after try to set scenario on undefined map', () => {
			const store = mockStore({...INITIAL_STATE, maps: {maps: {
				map1: {
					key: 'map1'
				}
			}}});

			const expectedActions = [{
				type: 'ERROR',
			}];
			store.dispatch(Action.maps.setMapScenario('mapXX', 111));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch setMapPeriod action', () => {
			const store = mockStore({...INITIAL_STATE, maps: {maps: {
				map1: {
					key: 'map1'
				}
			}}});

			const expectedActions = [{
				type: ActionTypes.MAPS.SET_PERIOD,
				mapKey: 'map1',
				period: 111,
			}];
			store.dispatch(Action.maps.setMapPeriod('map1', 111));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch ERROR action after try to set period on undefined map', () => {
			const store = mockStore({...INITIAL_STATE, maps: {maps: {
				map1: {
					key: 'map1'
				}
			}}});

			const expectedActions = [{
				type: 'ERROR',
			}];
			store.dispatch(Action.maps.setMapPeriod('mapXX', 111));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch setMapPlace action', () => {
			const store = mockStore({...INITIAL_STATE, maps: {maps: {
				map1: {
					key: 'map1'
				}
			}}});

			const expectedActions = [{
				type: ActionTypes.MAPS.SET_PLACE,
				mapKey: 'map1',
				place: 111,
			}];
			store.dispatch(Action.maps.setMapPlace('map1', 111));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch ERROR action after try to set place on undefined map', () => {
			const store = mockStore({...INITIAL_STATE, maps: {maps: {
				map1: {
					key: 'map1'
				}
			}}});

			const expectedActions = [{
				type: 'ERROR',
			}];
			store.dispatch(Action.maps.setMapPlace('mapXX', 111));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch setMapCase action', () => {
			const store = mockStore({...INITIAL_STATE, maps: {maps: {
				map1: {
					key: 'map1'
				}
			}}});

			const expectedActions = [{
				type: ActionTypes.MAPS.SET_CASE,
				mapKey: 'map1',
				case: 111,
			}];
			store.dispatch(Action.maps.setMapCase('map1', 111));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch ERROR action after try to set case on undefined map', () => {
			const store = mockStore({...INITIAL_STATE, maps: {maps: {
				map1: {
					key: 'map1'
				}
			}}});

			const expectedActions = [{
				type: 'ERROR',
			}];
			store.dispatch(Action.maps.setMapCase('mapXX', 111));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch setMapBackgroundLayer action', () => {
			const store = mockStore({...INITIAL_STATE, maps: {maps: {
				map1: {
					key: 'map1'
				}
			}}});

			const expectedActions = [{
				type: ActionTypes.MAPS.SET_BACKGROUND_LAYER,
				mapKey: 'map1',
				backgroundLayer: 111,
			}];
			store.dispatch(Action.maps.setMapBackgroundLayer('map1', 111));
			expect(store.getActions()).toEqual(expectedActions);
		});
		it('should dispatch ERROR action after try to set backgroundLayer on undefined map', () => {
			const store = mockStore({...INITIAL_STATE, maps: {maps: {
				map1: {
					key: 'map1'
				}
			}}});

			const expectedActions = [{
				type: 'ERROR',
			}];
			store.dispatch(Action.maps.setMapCase('mapXX', 111));
			expect(store.getActions()).toEqual(expectedActions);
		});
	});
});