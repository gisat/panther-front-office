import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

import ActionTypes from "../../../../constants/ActionTypes";
import commonActions from "../../../../state/_common/actions";
import {getSubstate, BASIC_STATE} from "../../../../__testUtils/sampleStates/_common";
import SampleActionTypes from "../../../../__testUtils/SampleActionTypes";

// mock module with empty function (it will be reimplemented for each test)
jest.mock('../../../../state/Action');
jest.mock('../../../../state/_common/request', () => {return jest.fn(() => {})});

const ACTION_TYPES = SampleActionTypes.SAMPLE;
const DATA_TYPE = 'sample';
const CATEGORY_TYPE = 'metadata';

describe('#apiUpdate', () => {
	const mockStore = configureMockStore([thunk]);

	it('should dispatch two actions for given input', () => {
		// mock store
		const store = mockStore({...BASIC_STATE});

		// test input parameters
		const editedData = [{
			key: 1,
			data: {
				description: "..."
			}
		}];

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				data: {
					[DATA_TYPE]: [{
						key: 1,
						data: {
							name: "World", // original value
							description: "..." // edited value
						}
					}]
				}
			});
		});

		return store.dispatch(commonActions.apiUpdate(getSubstate, DATA_TYPE, ACTION_TYPES, CATEGORY_TYPE, editedData)).then(() => {
			let actions = store.getActions();

			let actionAdd = _.find(actions, (action) => action.type === ACTION_TYPES.ADD);
			let actionRemoveEditedProperty = _.find(actions, (action) => action.type === ACTION_TYPES.EDITED.REMOVE_PROPERTY);

			expect(actions).toHaveLength(3);

			expect(actionAdd).toBeDefined();
			expect(actionAdd.data).toHaveLength(1);
			expect(actionAdd.data[0].key).toBe(1);

			expect(actionRemoveEditedProperty).toBeDefined();
			expect(actionRemoveEditedProperty.key).toBe(1);
			expect(actionRemoveEditedProperty.property).toBe('description');
		}).catch((err) => {
			fail(err);
		});
	});

	it('should dispatch error action, if error was returned for given data type', () => {
		// mock store
		const store = mockStore({...BASIC_STATE});

		// test input parameters
		const editedData = [{
			key: 1,
			data: {
				description: "..."
			}
		}];

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				errors: {
					[DATA_TYPE]: "Error"
				}
			});
		});

		return store.dispatch(commonActions.apiUpdate(getSubstate, DATA_TYPE, ACTION_TYPES, CATEGORY_TYPE, editedData)).then(() => {
			let actions = store.getActions();

			let actionError = _.find(actions, (action) => action.type === "ERROR");

			expect(actions).toHaveLength(1);
			expect(actionError).toBeDefined();
		}).catch((err) => {
			fail(err);
		});
	});

	it('should dispatch error action, if no data was returned for given data type', () => {
		// mock store
		const store = mockStore({...BASIC_STATE});

		// test input parameters
		const editedData = [{
			key: 1,
			data: {
				description: "..."
			}
		}];

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				data: {
					// different data type
					scopes: [{
						key: 1,
						data: {
							name: "World", // original value
							description: "..." // edited value
						}
					}]
				}
			});
		});

		return store.dispatch(commonActions.apiUpdate(getSubstate, DATA_TYPE, ACTION_TYPES, CATEGORY_TYPE, editedData)).then(() => {
			let actions = store.getActions();

			let actionError = _.find(actions, (action) => action.type === "ERROR");

			expect(actions).toHaveLength(1);
			expect(actionError).toBeDefined();
		}).catch((err) => {
			fail(err);
		});
	});
});