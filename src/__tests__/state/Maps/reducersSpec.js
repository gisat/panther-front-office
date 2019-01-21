import ActionTypes from '../../../constants/ActionTypes';
import mapsReducer from '../../../state/Maps/reducers';
import {Reducer} from 'redux-testkit';

const DEFAULT_STATE = {
	activeKey: null,
	activeMapKey: null,
	maps: {},
	sets: {}
};

const INITIAL_SET_STATE = {
	key: null,
	maps: [],
	sync: {
		location: null,
		range: null,
		tilt: null,
		heading: null
	},
	data: {}
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
			type: ActionTypes.MAPS.ADD_SET,
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
			type: ActionTypes.MAPS.ADD_SET,
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
							location: [111,222],
							range: null,
							tilt: null,
							heading: null
						}
					}
				}
			}
		};
		const action = {
			type: ActionTypes.MAPS.ADD_SET,
			set: {
				key: 'set1',
				sync: {
					location: [111,222]
				}
			}
		};
		Reducer(mapsReducer).withState({...DEFAULT_STATE}).expect(action).toReturnState(expectedResult);
	});
	
	// FIXME - jako by byl ovlivnován předchozím testem
	// it('Add set to current sets', () => {
	// 	const defaultState = {
	// 		...DEFAULT_STATE,
	// 		sets: {
	// 			'set1': {...INITIAL_SET_STATE, key: 'set1'},
	// 			'set2': {...INITIAL_SET_STATE, key: 'set2'},
	// 		}
	// 	}

	// 	const expectedResult = {
	// 		...DEFAULT_STATE,
	// 		sets:{
	// 			'set1': {...INITIAL_SET_STATE, key: 'set1'}, 
	// 			'set2': {...INITIAL_SET_STATE, key: 'set2'},
	// 			'set3': {...INITIAL_SET_STATE, key: 'set3'},
	// 		}
	// 	};

	// 	const action = {
	// 		type: ActionTypes.MAPS.ADD_SET,
	// 		set: {
	// 			key: 'set3',
	// 			sync: {}
	// 		}
	// 	};

	// 	Reducer(mapsReducer).withState({...defaultState}).expect(action).toReturnState(expectedResult);
	// });
	
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
			type: ActionTypes.MAPS.REMOVE_SET,
			setKey: 'set2',
		};
		Reducer(mapsReducer).withState(defaultState).expect(action).toReturnState(expectedResult);
	});
	
});