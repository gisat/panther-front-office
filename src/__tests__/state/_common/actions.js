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
					type: ActionTypes.SCOPES_ADD,
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
				type: ActionTypes.SCOPES_ADD,
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
});