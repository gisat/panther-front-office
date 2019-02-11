import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

import ActionTypes from "../../../../constants/ActionTypes";
import commonActions from "../../../../state/_common/actions";

jest.mock('../../../../state/Action');

describe('#receiveIndexed', () => {
	const mockStore = configureMockStore([thunk]);

	it('should dispatch actionAdd and actionAddIndexed, if any data were returned for given data type', () => {
		const store = mockStore({scopes: {}});

		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const filter = null;
		const order = [['name', 'ascending']];
		const start = 1;

		const result = {
			changes: {
				scopes: "2018-10-30T14:46:54.199Z"
			},
			data: {
				scopes: [{
					key: 1,
					data: {
						name: "London"
					}
				}]
			},
			limit: 10,
			offset: 0,
			success: true,
			total: 1
		};

		const expectedActions = _.sortBy([
			{
				type: ActionTypes.SCOPES.INDEX.ADD,
				filter,
				order,
			    start,
				data: result.data[dataType],
				count: result.total,
				changedOn: result.changes[dataType]
			}, {
				type: ActionTypes.SCOPES.ADD,
				data: [{key: 1, data: {name: 'London'}}]
			}], ['type']);

		store.dispatch(commonActions.receiveIndexed(actionTypes, result, dataType, filter, order, start));
		expect(_.sortBy(store.getActions(), ['type'])).toEqual(expectedActions);
	});


	it('should dispatch actionAddIndexed only, if no data were returned for given data type', () => {
		const store = mockStore({scopes: {}});

		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const filter = {
			description: "aaa"
		};
		const order = [['name', 'ascending']];
		const start = 1;

		const result = {
			changes: {
				scopes: "2018-10-30T14:46:54.199Z"
			},
			data: {
				scopes: []
			},
			limit: 10,
			offset: 0,
			success: true,
			total: 0
		};

		const expectedActions = [
			{
				type: ActionTypes.SCOPES.INDEX.ADD,
				filter,
				order,
				start,
				data: result.data[dataType],
				count: result.total,
				changedOn: result.changes[dataType]
			}];

		store.dispatch(commonActions.receiveIndexed(actionTypes, result, dataType, filter, order, start));
		expect(store.getActions()).toEqual(expectedActions);
	});
});