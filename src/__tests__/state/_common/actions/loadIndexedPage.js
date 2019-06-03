import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

import ActionTypes from "../../../../constants/ActionTypes";
import commonActions from "../../../../state/_common/actions";

// mock module with empty function (it will be reimplemented for each test)
jest.mock('../../../../state/Action');
jest.mock('../../../../state/_common/request', () => {return jest.fn(() => {})});

describe('#loadIndexedPage', () => {
	const mockStore = configureMockStore([thunk]);

	it('should dispatch action add and action index.add', () => {
		// mock store
		const store = mockStore({scopes: {}});

		// test input parameters
		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const changedOn = '2018-10-30T14:46:54.199Z';
		const filter = null;
		const order = [['name', 'ascending']];
		const start = 1;

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				changes: {
					scopes: '2018-10-30T14:46:54.199Z'
				},
				data: {
					scopes: [{
						key: 4029,
						data: {
							name: 'Austria'
						}
					}, {
						key: 4022,
						data: {
							name: 'Belgium'
						}
					},{
						key: 4023,
						data: {
							name: 'China'
						}
					}]
				},
			limit: 10,
			offset: 0,
			success: true,
			total: 3
			});
		});

		store.dispatch(commonActions.loadIndexedPage(dataType, filter, order, start, changedOn, actionTypes)).then(() => {
			let actions = store.getActions();
			let actionAdd = _.find(actions, (action) => action.type === actionTypes.ADD);
			let actionAddIndex = _.find(actions, (action) => action.type === actionTypes.INDEX.ADD);

			expect(actions).toHaveLength(2);
			expect(actionAdd).toBeDefined();
			expect(actionAdd.data).toHaveLength(3);
			expect(actionAdd.data[0].key).toBe(4029);

			expect(actionAddIndex).toBeDefined();
			expect(actionAddIndex.count).toBe(3);
		}).catch((err) => {
			fail(err);
		});
	});

	it('should dispatch action index.add only, if no data were received for given dataType', () => {
		// mock store
		const store = mockStore({scopes: {}});

		// test input parameters
		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const changedOn = '2018-10-30T14:46:54.199Z';
		const filter = null;
		const order = [['name', 'ascending']];
		const start = 1;

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				changes: {
					scopes: '2018-10-30T14:46:54.199Z'
				},
				data: {
					scopes: []
				},
				limit: 10,
				offset: 0,
				success: true,
				total: 3
			});
		});

		store.dispatch(commonActions.loadIndexedPage(dataType, filter, order, start, changedOn, actionTypes)).then(() => {
			let actions = store.getActions();
			let actionAddIndex = _.find(actions, (action) => action.type === actionTypes.INDEX.ADD);

			expect(actions).toHaveLength(1);

			expect(actionAddIndex).toBeDefined();
			expect(actionAddIndex.count).toBe(3);
		}).catch((err) => {
			fail(err);
		});
	});

	it('should dispatch error action if stored data are outdated', () => {
		// mock store
		const store = mockStore({scopes: {}});

		// test input parameters
		const actionTypes = ActionTypes.SCOPES;
		const dataType = 'scopes';
		const changedOn = '2018-10-30T14:46:54.199Z';
		const filter = null;
		const order = [['name', 'ascending']];
		const start = 1;

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				changes: {
					scopes: '2018-10-30T15:46:54.199Z' // it is later than stored date
				},
				data: {
					scopes: [{
						key: 4029,
						data: {
							name: 'Austria'
						}
					}, {
						key: 4022,
						data: {
							name: 'Belgium'
						}
					},{
						key: 4023,
						data: {
							name: 'China'
						}
					}]
				},
				limit: 10,
				offset: 0,
				success: true,
				total: 3
			});
		});

		store.dispatch(commonActions.loadIndexedPage(dataType, filter, order, start, changedOn, actionTypes)).then(() => {
			let actions = store.getActions();
			let actionError = _.find(actions, (action) => action.type === "ERROR");

			expect(actions).toHaveLength(1);
			expect(actionError).toBeDefined();
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
		const changedOn = '2018-10-30T14:46:54.199Z';
		const filter = null;
		const order = [['name', 'ascending']];
		const start = 1;

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				data: {
					places: [] // different data type returned
				}
			});
		});

		store.dispatch(commonActions.loadIndexedPage(dataType, filter, order, start, changedOn, actionTypes)).then(() => {
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
		const changedOn = '2018-10-30T14:46:54.199Z';
		const filter = null;
		const order = [['name', 'ascending']];
		const start = 1;

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				data: {
					scopes: [{
						key: 4029,
						data: {
							name: 'Austria'
						}
					}, {
						key: 4022,
						data: {
							name: 'Belgium'
						}
					},{
						key: 4023,
						data: {
							name: 'China'
						}
					}]
				},
				errors: {
					scopes: "Error message"
				}
			});
		});

		store.dispatch(commonActions.loadIndexedPage(dataType, filter, order, start, changedOn, actionTypes)).then(() => {
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
		const changedOn = '2018-10-30T14:46:54.199Z';
		const filter = null;
		const order = [['name', 'ascending']];
		const start = 1;

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.reject("Error");
		});

		store.dispatch(commonActions.loadIndexedPage(dataType, filter, order, start, changedOn, actionTypes)).then(() => {
			let actions = store.getActions();
			let actionError = _.find(actions, (action) => action.type === "ERROR");

			expect(actions).toHaveLength(1);
			expect(actionError).toBeDefined();
		}).catch((err) => {
			fail(err);
		});
	});
});