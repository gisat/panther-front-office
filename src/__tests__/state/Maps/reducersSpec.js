import ActionTypes from '../../../constants/ActionTypes';
import mapsReducer from '../../../state/Maps/reducers';
import {Reducer} from 'redux-testkit';

const INITIAL_LAYER_STATE = {
	key: null, //FIXME - add?
	layerTemplate: null,
	style: null,
	period: null,
	opacity: 100
}


const DEFAULT_STATE = {
	activeSetKey: null,
	activeMapKey: null,
	maps: {},
	sets: {}
};

const INITIAL_SET_STATE = {
	key: null,
	maps: [],
	sync: {
		location: false,
		roll: false,
		range: false,
		tilt: false,
		heading: false,
		elevation: false,
	},
	data: {}
}

const INITIAL_WORLDWINDNAVIGATOR = {
	lookAtLocation: {
		latitude: 50.1,
		longitude: 14.5
	},
	roll: 0,
	range: 100000,
	tilt: 0,
	heading: 0,
	elevation: 0
};

const INITIAL_MAP_STATE = {
	key: '',
	name: null,
	data: {
		// scope: null,
		// place: null,
		// scenario: null,
		// case: null,
		// period: null,
		// backgroundLayer: null,
		// layers: [],
		// worldWindNavigator: null,
	}
}

const INIT_LAYER_STYTE = {
	key: null,
}

// todo solve issue with window
describe('Maps Reducers', () => {
	it('Should have initial state', () => {
		expect(mapsReducer(undefined, {})).toEqual(DEFAULT_STATE);
	});
	
	
	it('Set active map key', () => {
		const expectedResult = {
			activeMapKey: 'Map1'
		};
		const action = {
			type: ActionTypes.MAPS.SET_ACTIVE_MAP_KEY,
			mapKey: 'Map1'
		};
		Reducer(mapsReducer).withState(DEFAULT_STATE).expect(action).toReturnState({...DEFAULT_STATE,...expectedResult});
	});
	
	it('Set active map key to null', () => {
		const expectedResult = {
			activeMapKey: null
		};
		const action = {
			type: ActionTypes.MAPS.SET_ACTIVE_MAP_KEY,
			mapKey: null
		};
		Reducer(mapsReducer).withState(DEFAULT_STATE).expect(action).toReturnState({...DEFAULT_STATE,...expectedResult});
	});
	
	it('Add empty set', () => {
		const action = {
			type: ActionTypes.MAPS.SET.ADD,
			set: null
		};
		Reducer(mapsReducer).withState(DEFAULT_STATE).expect(action).toReturnState({...DEFAULT_STATE, sets: {null: INITIAL_SET_STATE}});
	});
	
	it('Add set', () => {
		const expectedResult = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
					...{
						key: 'set1'
					}
				}
			}
		};
		const action = {
			type: ActionTypes.MAPS.SET.ADD,
			set: {
				key: 'set1'
			}
		};
		Reducer(mapsReducer).withState(DEFAULT_STATE).expect(action).toReturnState(expectedResult);
	});
	
	it('Add set with sync', () => {
		const expectedResult = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
					...{
						key: 'set1',
						sync: {
							location: true,
							roll: false,
							range: false,
							tilt: false,
							heading: false,
							elevation: false,
						}
					}
				}
			}
		};
		const action = {
			type: ActionTypes.MAPS.SET.ADD,
			set: {
				key: 'set1',
				sync: {
					location: true
				}
			}
		};
		Reducer(mapsReducer).withState({...DEFAULT_STATE}).expect(action).toReturnState(expectedResult);
	});
	
	it('Add set to current sets', () => {
		const defaultState = {
			...DEFAULT_STATE,
			sets: {
				'set1': {...INITIAL_SET_STATE, key: 'set1'},
				'set2': {...INITIAL_SET_STATE, key: 'set2'},
			}
		}

		const expectedResult = {
			...DEFAULT_STATE,
			sets:{
				'set1': {...INITIAL_SET_STATE, key: 'set1'}, 
				'set2': {...INITIAL_SET_STATE, key: 'set2'},
				'set3': {...INITIAL_SET_STATE, key: 'set3'},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET.ADD,
			set: {
				key: 'set3',
				sync: {}
			}
		};

		Reducer(mapsReducer).withState({...defaultState}).expect(action).toReturnState(expectedResult);
	});
	
	it('Remove set', () => {
		const defaultState = {
			...DEFAULT_STATE,
			sets: {
				'set1': {...INITIAL_SET_STATE}, 
				'set2': {...INITIAL_SET_STATE},
				'set3': {...INITIAL_SET_STATE},
			}
		}

		const expectedResult = {
			...DEFAULT_STATE,
			sets:{
				'set1': {...INITIAL_SET_STATE}, 
				'set3': {...INITIAL_SET_STATE},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET.REMOVE,
			setKey: 'set2',
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});

	it('Remove last set', () => {
		const defaultState = {
			...DEFAULT_STATE,
			sets: {
				'set3': {...INITIAL_SET_STATE},
			}
		}

		const expectedResult = {
			...DEFAULT_STATE,
			sets:{}
		};

		const action = {
			type: ActionTypes.MAPS.SET.REMOVE,
			setKey: 'set3',
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});

	it('Remove not existing set', () => {
		const defaultState = {
			...DEFAULT_STATE,
		}

		const expectedResult = {
			...DEFAULT_STATE,
			sets:{}
		};

		const action = {
			type: ActionTypes.MAPS.SET.REMOVE,
			setKey: 'set1',
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Add map to set', () => {
		const defaultState = {
			...DEFAULT_STATE,
			sets: {
				'set1': {...INITIAL_SET_STATE},
			}
		}

		const expectedResult = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
					maps: ['map1']
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET.ADD_MAP,
			setKey: 'set1',
			mapKey: 'map1',
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Add map to set', () => {
		const defaultState = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
					maps: ['map1','map2']
				},
				'set2': {...INITIAL_SET_STATE},
			}
		}

		const expectedResult = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
					maps: ['map1','map2', 'map3']
				},
				'set2': {...INITIAL_SET_STATE},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET.ADD_MAP,
			setKey: 'set1',
			mapKey: 'map3',
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Remove map from set', () => {
		const defaultState = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
					maps: ['map1','map2']
				},
				'set2': {...INITIAL_SET_STATE},
			}
		}

		const expectedResult = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
					maps: ['map2']
				},
				'set2': {...INITIAL_SET_STATE},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET.REMOVE_MAP,
			setKey: 'set1',
			mapKey: 'map1',
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Remove map from set', () => {
		const defaultState = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
					maps: ['map2']
				},
				'set2': {...INITIAL_SET_STATE},
			}
		}

		const expectedResult = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
					maps: []
				},
				'set2': {...INITIAL_SET_STATE},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET.REMOVE_MAP,
			setKey: 'set1',
			mapKey: 'map2',
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Set default World Wind navigator state', () => {
		const defaultState = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
				},
			}
		};

		const expectedResult = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
					data: {
						worldWindNavigator: INITIAL_WORLDWINDNAVIGATOR
					}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET.SET_WORLD_WIND_NAVIGATOR,
			setKey: 'set1',
			worldWindNavigator: null,
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Set World Wind navigator state', () => {
		const defaultState = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
					data: {
						worldWindNavigator: INITIAL_WORLDWINDNAVIGATOR
					}
				},
			}
		}

		const expectedResult = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
					data: {
						worldWindNavigator: {
							lookAtLocation: {
								latitude: 51.123,
								longitude: 14.321
							},
							roll: 12,
							range: 12,
							tilt: 12,
							heading: 12,
							elevation: 12
						}
					}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET.SET_WORLD_WIND_NAVIGATOR,
			setKey: 'set1',
			worldWindNavigator: {
				lookAtLocation: {
					latitude: 51.123,
					longitude: 14.321
				},
				roll: 12,
				range: 12,
				tilt: 12,
				heading: 12,
				elevation: 12
			}
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Set set sync', () => {
		const defaultState = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
				},
			}
		}

		const expectedResult = {
			...DEFAULT_STATE,
			sets: {
				'set1': {
					...INITIAL_SET_STATE,
					sync: {
						...INITIAL_SET_STATE.sync,
						location: true,
					}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET.SET_SYNC,
			setKey: 'set1',
			sync: {
				location:true,
			}
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Set init map state', () => {
		const defaultState = {
			...DEFAULT_STATE,
		}

		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				'': INITIAL_MAP_STATE,
			}
		};

		const action = {
			type: ActionTypes.MAPS.MAP.ADD,
			map: null
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Add map state', () => {
		const defaultState = {
			...DEFAULT_STATE,
		}

		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					key: 'map1',
					name: 'mapa 1',
					data: {}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.MAP.ADD,
			map: {key: 'map1', name: 'mapa 1'}
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Add/Set map state - rewrite current map state by new one', () => {

		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					key: 'map1',
					name: 'mapa 1',
					data: {
						scope: 1,
						place: 2,
						scenario: 3,
						case: 4,
						period: 5,
						backgroundLayer: 6,
						layers: [1],
						worldWindNavigator: {},
					}
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					key: 'map1',
					name: 'map first',
					data: {}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.MAP.ADD,
			map: {key: 'map1', name: 'map first'}
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Remove map state', () => {

		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					key: 'map1',
					name: 'mapa 1',
					data: {
						scope: null,
						place: null,
						scenario: null,
						case: null,
						period: null,
						backgroundLayer: null,
						layers: [],
						worldWindNavigator: null,
					}
				},
				map2: {
					key: 'map2',
					name: 'mapa 2',
					data: {
						scope: null,
						place: null,
						scenario: null,
						case: null,
						period: null,
						backgroundLayer: null,
						layers: [],
						worldWindNavigator: null,
					}
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map2: {
					key: 'map2',
					name: 'mapa 2',
					data: {
						scope: null,
						place: null,
						scenario: null,
						case: null,
						period: null,
						backgroundLayer: null,
						layers: [],
						worldWindNavigator: null,
					}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.MAP.REMOVE,
			mapKey: 'map1'
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Remove map state even from set', () => {

		const defaultState = {
			...DEFAULT_STATE,
			sets: {
				'set': {
					...INITIAL_SET_STATE,
					key: 'set',
					maps: ['map1']
				},
			},
			maps: {
				map1: {
					key: 'map1',
					name: 'mapa 1',
					data: {
						scope: null,
						place: null,
						scenario: null,
						case: null,
						period: null,
						backgroundLayer: null,
						layers: [],
						worldWindNavigator: null,
					}
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {},
			sets: {
				'set': {
					...INITIAL_SET_STATE,
					key: 'set',
				},
			},
		};

		const action = {
			type: ActionTypes.MAPS.MAP.REMOVE,
			mapKey: 'map1'
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Set map name', () => {

		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					name: 'mapa',
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					name: 'first map',
				},
			},
		};

		const action = {
			type: ActionTypes.MAPS.MAP.SET_NAME,
			mapKey: 'map1',
			name: 'first map'
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Set map world wind navigator', () => {

		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						worldWindNavigator: {
							...INITIAL_WORLDWINDNAVIGATOR,
							location: [100, 100]
						}
					}
				},
			},
		};

		const action = {
			type: ActionTypes.MAPS.MAP.SET_WORLD_WIND_NAVIGATOR,
			mapKey: 'map1',
			worldWindNavigator: {
				location: [100, 100]
			}
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Set map data', () => {

		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						testKey: 'test'
					}
				},
			},
		};

		const action = {
			type: ActionTypes.MAPS.MAP.SET_DATA,
			mapKey: 'map1',
			data: {
				testKey: 'test'
			}
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Set map data', () => {

		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						testKey: 'test'
					}
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						testKey: 'rewrite',
						newKey: 'new'
					}
				},
			},
		};

		const action = {
			type: ActionTypes.MAPS.MAP.SET_DATA,
			mapKey: 'map1',
			data: {
				testKey: 'rewrite',
				newKey: 'new',
			}
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	it('Set map data', () => {

		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						testKey: 'test'
					}
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						testKey2: 'rewrite2',
					}
				},
			},
		};

		const action = {
			type: ActionTypes.MAPS.MAP.SET_DATA,
			mapKey: 'map1',
			data: {
				testKey2: 'rewrite2',
			}
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Add layer', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								key: 'layer1'
							}
						]
					}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.LAYERS.ADD_LAYER,
			mapKey: 'map1',
			layer: {
				key: 'layer1'
			},
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});

	it('Add layer', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								key: 'layer1'
							}
						]
					}
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								key: 'layer1'
							},
							{
								key: 'layer2'
							}
						]
					}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.LAYERS.ADD_LAYER,
			mapKey: 'map1',
			layer: {
				key: 'layer2'
			},
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Add layers', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								key: 'layer1'
							},
							{
								key: 'layer2'
							}
						]
					}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.LAYERS.ADD_LAYERS,
			mapKey: 'map1',
			layers: [
				{
					key: 'layer1'
				},
				{
					key: 'layer2'
				}
			],
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Remove layer', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								key: 'layer1'
							},
							{
								key: 'layer2'
							}
						]
					}
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								key: 'layer2'
							}
						]
					}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.LAYERS.REMOVE_LAYER,
			mapKey: 'map1',
			layerKey: 'layer1'
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Remove layer', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								key: 'layer1'
							},
						]
					}
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: []
					}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.LAYERS.REMOVE_LAYER,
			mapKey: 'map1',
			layerKey: 'layer1'
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Remove layers', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								key: 'layer1'
							},
							{
								key: 'layer2'
							},
							{
								key: 'layer3'
							},
						]
					}
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: []
					}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.LAYERS.REMOVE_LAYERS,
			mapKey: 'map1',
			layersKeys: ['layer1', 'layer2', 'layer3']
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Set layer index', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								key: 'layer1'
							},
							{
								key: 'layer2'
							},
							{
								key: 'layer3'
							},
						]
					}
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								key: 'layer3'
							},
							{
								key: 'layer1'
							},
							{
								key: 'layer2'
							},
						]
					}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.LAYERS.SET_LAYER_INDEX,
			mapKey: 'map1',
			layerKey: 'layer3',
			index: 0,
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Set layer index', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								key: 'layer1'
							},
							{
								key: 'layer2'
							},
							{
								key: 'layer3'
							},
						]
					}
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								key: 'layer2'
							},
							{
								key: 'layer3'
							},
							{
								key: 'layer1'
							},
						]
					}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.LAYERS.SET_LAYER_INDEX,
			mapKey: 'map1',
			layerKey: 'layer1',
			index: 2,
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
	it('Update map layer', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								...INITIAL_LAYER_STATE,
								key: 'layer1',
							},
							{
								...INITIAL_LAYER_STATE,
								key: 'layer2'
							},
						]
					}
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					data: {
						...INITIAL_MAP_STATE.data,
						layers: [
							{
								...INITIAL_LAYER_STATE,
								key: 'layer1',
								layerTemplate: 22,
							},
							{
								...INITIAL_LAYER_STATE,
								key: 'layer2'
							},
						]
					}
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.LAYERS.UPDATE_MAP_LAYER,
			mapKey: 'map1',
			layer: {
				key: 'layer1',
				layerTemplate: 22,
			},
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});

	it('Update map layer', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					scope: 1111,
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET_SCOPE,
			mapKey: 'map1',
			scope: 1111
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});


	it('Set map scope', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					scope: 1111,
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET_SCOPE,
			mapKey: 'map1',
			scope: 1111
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});

	it('Set map scenario', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					scenario: 1111,
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET_SCENARIO,
			mapKey: 'map1',
			scenario: 1111
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});

	it('Set map period', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					period: 1111,
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET_PERIOD,
			mapKey: 'map1',
			period: 1111
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});

	it('Set map place', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					place: 1111,
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET_PLACE,
			mapKey: 'map1',
			place: 1111
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});

	it('Set map case', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					case: 1111,
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET_CASE,
			mapKey: 'map1',
			case: 1111
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});

	it('Set map backgroundLayer', () => {
		const defaultState = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
				},
			}
		};
		
		const expectedResult = {
			...DEFAULT_STATE,
			maps: {
				map1: {
					...INITIAL_MAP_STATE,
					key: 'map1',
					backgroundLayer: 1111,
				},
			}
		};

		const action = {
			type: ActionTypes.MAPS.SET_BACKGROUND_LAYER,
			mapKey: 'map1',
			backgroundLayer: 1111
		};

		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
});