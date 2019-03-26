import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

import Action from  '../../../../state/Action';
import ActionTypes from  '../../../../constants/ActionTypes';

const mockStore = configureMockStore([thunk]);

const crypto = require('crypto');

Object.defineProperty(global.self, 'crypto', {
	value: {
		getRandomValues: arr => crypto.randomBytes(arr.length),
	},
});

const INITIAL_STATE = {
	apps: {},
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
describe('MapsStore Layers Actions', () => {
	it('should dispatch addLayer action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1'
			}
		}}});

		const expectedActions = [{
			type: ActionTypes.MAPS.LAYERS.LAYER.ADD,
			mapKey: 'map1',
			layer: {key: 'layer1'}
		}];
		store.dispatch(Action.maps.addLayer('map1', {key: 'layer1'}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR after try to addLayer on undefined mapKey', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1'
			}
		}}});

		const expectedActions = [{
			type: 'ERROR'
		}];
		store.dispatch(Action.maps.addLayer('map2', {key: 'layer1'}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR after try to addLayer on without layerKey', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1'
			}
		}}});

		store.dispatch(Action.maps.addLayer('map1', {}));
		expect(store.getActions()[0].type).toEqual("MAPS.LAYERS.LAYER.ADD");
	});
	it('should dispatch addLayers action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1'
			}
		}}});

		const expectedActions = [{
				type: ActionTypes.MAPS.LAYERS.LAYER.ADD,
				mapKey: 'map1',
				layer: {key: 'layer1'}
			},
			{
				type: ActionTypes.MAPS.LAYERS.LAYER.ADD,
				mapKey: 'map1',
				layer: {key: 'layer2'}
			}
		];
		store.dispatch(Action.maps.addLayers('map1', [{key: 'layer1'}, {key: 'layer2'}]));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch addLayer and ERROR action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1'
			}
		}}});

		store.dispatch(Action.maps.addLayers('map1', [{key: 'layer1'}, {}]));
		let actions = store.getActions();

		expect(actions).toHaveLength(2);
		expect(actions[1].type).toBe("MAPS.LAYERS.LAYER.ADD");
	});
	it('should dispatch ERROR action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1'
			}
		}}});

		const expectedActions = [
			{
				type: 'ERROR'
			}
		];
		store.dispatch(Action.maps.addLayers('map2', [{key: 'layer1'}, {key: 'layer2'}]));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch removeLayer action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				data: {
					layers: [{key: 'layer1'}]
				}
			}
		}}});

		const expectedActions = [
			{
				type: ActionTypes.MAPS.LAYERS.LAYER.REMOVE,
				mapKey: 'map1',
				layerKey: 'layer1',
			}
		];
		store.dispatch(Action.maps.removeLayer('map1', 'layer1'));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try to remove undefined layer', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				data: {
					layers: []
				}
			}
		}}});

		const expectedActions = [
			{
				type: 'ERROR'
			}
		];
		store.dispatch(Action.maps.removeLayer('map1', 'layer1'));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch removeLayers action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				data: {
					layers: [{key: 'layer1'}, {key: 'layer2'}]
				}
			}
		}}});

		const expectedActions = [
			{
				type: ActionTypes.MAPS.LAYERS.LAYER.REMOVE,
				mapKey: 'map1',
				layerKey: 'layer1',
			},
			{
				type: ActionTypes.MAPS.LAYERS.LAYER.REMOVE,
				mapKey: 'map1',
				layerKey: 'layer2',
			}
		];
		store.dispatch(Action.maps.removeLayers('map1', ['layer1', 'layer2']));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try to remove from undefined mapKey', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				data: {
					layers: []
				}
			}
		}}});

		const expectedActions = [
			{
				type: 'ERROR'
			}
		];
		store.dispatch(Action.maps.removeLayers('map2', 'layer1'));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try to remove undefined layerKey', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				data: {
					layers: [{
						key: 'layer1'
					}]
				}
			}
		}}});

		const expectedActions = [
			{
				type: ActionTypes.MAPS.LAYERS.LAYER.REMOVE,
				mapKey: 'map1',
				layerKey: 'layer1',
			},
			{
				type: 'ERROR'
			}
		];
		store.dispatch(Action.maps.removeLayers('map1', ['layer1', 'layer3']));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch setLayerIndex action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				data: {
					layers: [{key: 'layer1'}, {key: 'layer2'}, {key: 'layer3'}]
				}
			}
		}}});

		const expectedActions = [
			{
				type: ActionTypes.MAPS.LAYERS.LAYER.SET_INDEX,
				mapKey: 'map1',
				layerKey: 'layer1',
				index: 2
			}
		];
		store.dispatch(Action.maps.setLayerIndex('map1', 'layer1', 2));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try to setIndex on undefined mapKey', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				data: {
					layers: [{key: 'layer1'}, {key: 'layer2'}, {key: 'layer3'}]
				}
			}
		}}});

		const expectedActions = [
			{
				type: 'ERROR'
			}
		];
		store.dispatch(Action.maps.setLayerIndex('map2', 'layer1', 2));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch updateMapLayer action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				data: {
					layers: [
						{
							key: 'layer1'
						}
					]
				}
			}
		}}});

		const expectedActions = [{
			type: ActionTypes.MAPS.LAYERS.LAYER.UPDATE,
			mapKey: 'map1',
			layerKey: 'layer1',
			layer: {key: 'layer1'}
		}];
		store.dispatch(Action.maps.updateMapLayer('map1', 'layer1', {key: 'layer1'}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try to update layer in undefined map', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				data: {
					layers: [
						{
							key: 'layer1'
						}
					]
				}
			}
		}}});

		const expectedActions = [{
			type: 'ERROR',
		}];
		store.dispatch(Action.maps.updateMapLayer('map2', 'layer1', {key: 'layer1'}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try to update undefined layer', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				data: {
					layers: [
						{
							key: 'layer1'
						}
					]
				}
			}
		}}});

		const expectedActions = [{
			type: 'ERROR',
		}];
		store.dispatch(Action.maps.updateMapLayer('map1', 'layer2', {key: 'layer2'}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch setMapLayer action', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				data: {
					layers: [
						{
							key: 'layer1'
						}
					]
				}
			}
		}}});

		const expectedActions = [{
			type: ActionTypes.MAPS.LAYERS.LAYER.SET,
			mapKey: 'map1',
			layerKey: 'layer1',
			layer: {key: 'layer1'}
		}];
		store.dispatch(Action.maps.setMapLayer('map1', 'layer1', {key: 'layer1'}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try to set layer in undefined map', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				data: {
					layers: [
						{
							key: 'layer1'
						}
					]
				}
			}
		}}});

		const expectedActions = [{
			type: 'ERROR',
		}];
		store.dispatch(Action.maps.setMapLayer('map2', 'layer1', {key: 'layer1'}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	it('should dispatch ERROR action after try to set undefined layer', () => {
		const store = mockStore({...INITIAL_STATE, maps: {maps: {
			map1: {
				key: 'map1',
				data: {
					layers: [
						{
							key: 'layer1'
						}
					]
				}
			}
		}}});

		const expectedActions = [{
			type: 'ERROR',
		}];
		store.dispatch(Action.maps.setMapLayer('map1', 'layer2', {key: 'layer2'}));
		expect(store.getActions()).toEqual(expectedActions);
	});
	



	
	// updateMapLayer,

});