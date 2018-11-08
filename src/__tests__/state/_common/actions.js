import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ActionTypes from  '../../../constants/ActionTypes';
import Action from '../../../state/Action';

import commonActions from '../../../state/_common/actions';

const mockStore = configureMockStore([thunk]);

describe('Common Actions', () => {
	describe('#add', () => {
		it('should dispatch action add', () => {
			const store = mockStore({scopes: {}});
			const action = (data) => {
				return {
					type: ActionTypes.SCOPES.ADD,
					data: data
				}
			};
			const model = {
				key: 1,
				data: {
					name: "World"
				}
			};
			const expectedActions = [{
				type: ActionTypes.SCOPES.ADD,
				data: [{
					key: 1,
					data: {
						name: "World"
					}
				}]
			}];
			store.dispatch(commonActions.add(action)(model));
			expect(store.getActions()).toEqual(expectedActions);
		});
	});

	describe('#setActiveKey', () => {
		it('should dispatch action set active key', () => {
			const store = mockStore({});
			const action = (key) => {
				return {
					type: ActionTypes.PERIODS.SET_ACTIVE_KEY,
					key: key
				}
			};
			const key = 2;
			const expectedActions = [{
				type: ActionTypes.PERIODS.SET_ACTIVE_KEY,
				key: 2
			}];
			store.dispatch(commonActions.setActiveKey(action)(key));
			expect(store.getActions()).toEqual(expectedActions);
		});
	});

	describe('#setActiveKeys', () => {
		it('should dispatch action set active keys', () => {
			const store = mockStore({});
			const action = (keys) => {
				return {
					type: ActionTypes.ATTRIBUTE_SETS.SET_ACTIVE_KEYS,
					keys: keys
				}
			};
			const keys = [2, 3];
			const expectedActions = [{
				type: ActionTypes.ATTRIBUTE_SETS.SET_ACTIVE_KEYS,
				keys: [2, 3]
			}];
			store.dispatch(commonActions.setActiveKeys(action)(keys));
			expect(store.getActions()).toEqual(expectedActions);
		});
	});
});