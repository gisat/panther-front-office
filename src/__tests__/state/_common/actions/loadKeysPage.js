import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

import ActionTypes from "../../../../constants/ActionTypes";
import commonActions from "../../../../state/_common/actions";

// mock module with empty function (it will be reimplemented for each test)
jest.mock('../../../../state/_common/request', () => {return jest.fn(() => {})});

describe('#loadKeysPage', () => {
	const mockStore = configureMockStore([thunk]);

	it('should dispatch two actions with expected type and payload', () => {
		// mock store
		const store = mockStore({scopes: {}});

		// test input parameters
		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const keys = [1, 2];

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				data: {
					scopes: [{
						key: 1,
						data: {
							name: "Budova ve dvoře"
						}
					}]
				}
			});
		});

		store.dispatch(commonActions.loadKeysPage(dataType, actionTypes, keys)).then(() => {
			let actions = store.getActions();
			let actionAdd = _.find(actions, (action) => action.type === actionTypes.ADD);
			let actionAddUnreceived = _.find(actions, (action) => action.type === actionTypes.ADD_UNRECEIVED);

			expect(actions).toHaveLength(2);

			expect(actionAdd).toBeDefined();
			expect(actionAdd.data).toHaveLength(1);
			expect(actionAdd.data[0].key).toBe(1);

			expect(actionAddUnreceived).toBeDefined();
			expect(actionAddUnreceived.keys).toHaveLength(1);
			expect(actionAddUnreceived.keys[0]).toBe(2);
		}).catch((err) => {
			fail(err);
		});
	});

	it('should dispatch add action with expected payload', () => {
		// mock store
		const store = mockStore({scopes: {}});

		// test input parameters
		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const keys = ["a", "b"];

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				data: {
					scopes: [{
						key: 'a',
						data: {
							name: "Budova ve dvoře"
						}
					},{
						key: 'b',
						data: {
							name: "Buď jsi král nebo ne"
						}
					}]
				}
			});
		});

		store.dispatch(commonActions.loadKeysPage(dataType, actionTypes, keys)).then(() => {
			let actions = store.getActions();
			let actionAdd = _.find(actions, (action) => action.type === actionTypes.ADD);

			expect(actions).toHaveLength(1);
			expect(actionAdd).toBeDefined();
			expect(actionAdd.data).toHaveLength(2);
		}).catch((err) => {
			fail(err);
		});
	});

	it('should dispatch add unreceived action with expected payload', () => {
		// mock store
		const store = mockStore({scopes: {}});

		// test input parameters
		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const keys = [1, 2, 3];

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				data: {
					scopes: [] // no data for given dataType returned
				}
			});
		});

		store.dispatch(commonActions.loadKeysPage(dataType, actionTypes, keys)).then(() => {
			let actions = store.getActions();
			let actionAddUnreceived = _.find(actions, (action) => action.type === actionTypes.ADD_UNRECEIVED);

			expect(actions).toHaveLength(1);
			expect(actionAddUnreceived).toBeDefined();
			expect(actionAddUnreceived.keys).toHaveLength(3);
		}).catch((err) => {
			fail(err);
		});
	});

	it('should dispatch error action, if responses does not contain given dataType', () => {
		// mock store
		const store = mockStore({scopes: {}});

		// test input parameters
		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const keys = [1, 2, 3];

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				data: {
					places: [] // different data type returned
				}
			});
		});

		store.dispatch(commonActions.loadKeysPage(dataType, actionTypes, keys)).then(() => {
			let actions = store.getActions();
			let actionError = _.find(actions, (action) => action.type === "ERROR");

			expect(actions).toHaveLength(1);
			expect(actionError).toBeDefined();
		}).catch((err) => {
			fail(err);
		});
	});

	it('should dispatch error action, if response for any dataType contains error', () => {
		// mock store
		const store = mockStore({scopes: {}});

		// test input parameters
		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const keys = [1];

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				data: {
					scopes: [{
						key: 1,
						data: {
							name: "Budova ve dvoře"
						}
					}]
				},
				errors: {
					scopes: "Error message"
				}
			});
		});

		store.dispatch(commonActions.loadKeysPage(dataType, actionTypes, keys)).then(() => {
			let actions = store.getActions();
			let actionError = _.find(actions, (action) => action.type === "ERROR");

			expect(actions).toHaveLength(1);
			expect(actionError).toBeDefined();
		}).catch((err) => {
			fail(err);
		});
	});

	it('should dispatch error action, if error occured', () => {
		// mock store
		const store = mockStore({scopes: {}});

		// test input parameters
		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const keys = [1];

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.reject("Error");
		});

		store.dispatch(commonActions.loadKeysPage(dataType, actionTypes, keys)).then(() => {
			let actions = store.getActions();
			let actionError = _.find(actions, (action) => action.type === "ERROR");

			expect(actions).toHaveLength(2);
			expect(actionError).toBeDefined();
		}).catch((err) => {
			fail(err);
		});
	});
});