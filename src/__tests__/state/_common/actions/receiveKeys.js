import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

import ActionTypes from "../../../../constants/ActionTypes";
import commonActions from "../../../../state/_common/actions";

jest.mock('../../../../state/Action');

describe('#receiveKeys', () => {
	const mockStore = configureMockStore([thunk]);

	it('should dispatch action add with expected data', () => {
		const store = mockStore({scopes: {}});

		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const keys = [1];
		const result = {
			data: {
				scopes: [{
					key: 1,
					data: {
						name: "London"
					}
				}]
			}
		};

		const expectedActions = [{
			type: ActionTypes.SCOPES.ADD,
			data: [{key: 1, data: {name: 'London'}}]
		}];

		store.dispatch(commonActions.receiveKeys(actionTypes, result, dataType, keys));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should dispatch both actionAdd and actionUnreceivedKeys, if some keys was not returned', () => {
		const store = mockStore({scopes: {}});

		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const keys = [1, 2]; // key 2 was not returned from server
		const result = {
			data: {
				scopes: [{
					key: 1,
					data: {
						name: "London"
					}
				}]
			}
		};

		const expectedActions = _.sortBy([
			{
				type: ActionTypes.SCOPES.ADD_UNRECEIVED,
				keys: [2]
			}, {
				type: ActionTypes.SCOPES.ADD,
				data: [{key: 1, data: {name: 'London'}}]
			}], ['type']);

		store.dispatch(commonActions.receiveKeys(actionTypes, result, dataType, keys));
		expect(_.sortBy(store.getActions(), ['type'])).toEqual(expectedActions);
	});

	it('should dispatch actionUnreceivedKeys, if no data were returned for given data type', () => {
		const store = mockStore({scopes: {}});

		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const keys = [1, 2]; // key 2 was not returned from server
		const result = {
			data: {
				scopes: []
			}
		};

		const expectedActions = [{
				type: ActionTypes.SCOPES.ADD_UNRECEIVED,
				keys: [1,2]
			}];

		store.dispatch(commonActions.receiveKeys(actionTypes, result, dataType, keys));
		expect(store.getActions()).toEqual(expectedActions);
	});
});