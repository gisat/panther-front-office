import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ActionTypes from "../../../../constants/ActionTypes";
import commonActions from "../../../../state/_common/actions";

describe('#creator', () => {
	const mockStore = configureMockStore([thunk]);

	it('should dispatch expected action', () => {
		const store = mockStore({scopes: {}});
		const actionAdd = commonActions.actionAdd;
		const payload = [{key: 1, data: {name: 'London'}}, {key: 2, data: {name: 'Prague'}}];

		const expectedActions = [{
			type: ActionTypes.SCOPES.ADD,
			data: [{key: 1, data: {name: 'London'}}, {key: 2, data: {name: 'Prague'}}]
		}];

		store.dispatch(commonActions.creator(actionAdd)(ActionTypes.SCOPES)(payload));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should dispatch expected action even if it gets general action', () => {
		const store = mockStore({scopes: {}});
		const actionAdd = (actionTypes, fruit, vegetable) => {
			return commonActions.action(actionTypes, 'ADD', {fruit, vegetable});
		};

		const expectedActions = [{
			type: ActionTypes.SCOPES.ADD,
			fruit: 'apple',
			vegetable: 'onion'
		}];

		store.dispatch(commonActions.creator(actionAdd)(ActionTypes.SCOPES)('apple', 'onion'));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should dispatch expected action even if it gets scpecific action', () => {
		const store = mockStore({scopes: {}});
		const actionAdd = (actionTypes, fruit, vegetable) => {
			return {
				type: actionTypes.ADD,
				fruit: fruit,
				vegetable: vegetable
			};
		};

		const expectedActions = [{
			type: ActionTypes.SCOPES.ADD,
			fruit: 'apple',
			vegetable: 'onion'
		}];

		store.dispatch(commonActions.creator(actionAdd)(ActionTypes.SCOPES)('apple', 'onion'));
		expect(store.getActions()).toEqual(expectedActions);
	});
});