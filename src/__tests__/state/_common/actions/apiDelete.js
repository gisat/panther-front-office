import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';


import commonActions from "../../../../state/_common/actions";
import {getSubstate, BASIC_STATE} from "../../../../__testUtils/sampleStates/_common";
import SampleActionTypes from "../../../../__testUtils/SampleActionTypes";

// mock module with empty function (it will be reimplemented for each test)
jest.mock('../../../../state/Action');
jest.mock('../../../../state/_common/request', () => {return jest.fn(() => {})});

const ACTION_TYPES = SampleActionTypes.SAMPLE;
const DATA_TYPE = 'sample';
const CATEGORY_TYPE = 'metadata';


describe('#apiDelete', () => {
	const mockStore = configureMockStore([thunk]);

	it('should fail on delete response with different key', () => {
		// mock store
		const store = mockStore({...BASIC_STATE});

		// test input parameters
		const deleteData = {
			key: 2,
			data: {
				description: "..."
			}
		};

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				data: {
					[DATA_TYPE]: [{
						key: 9999,
						data: { //deleted data
							description: "..."
						}
					}]
				}
			});
		});

		return store.dispatch(commonActions.delete(getSubstate, DATA_TYPE, ACTION_TYPES, CATEGORY_TYPE)(deleteData)).then(() => {
			let actions = store.getActions();

			let actionError = _.find(actions, (action) => action.type === "ERROR");

			expect(actions).toHaveLength(1);
			expect(actionError).toBeDefined();
		}).catch((err) => {
			fail(err);
		});
	});
	it('should delete item by key', () => {
		// mock store
		const store = mockStore({...BASIC_STATE});

		// test input parameters
		const deleteData = {
			key: 2,
			data: {
				description: "..."
			}
		};

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				data: {
					[DATA_TYPE]: [{
						key: 2,
						data: { //deleted data
							description: "..."
						}
					}]
				}
			});
		});

		return store.dispatch(commonActions.delete(getSubstate, DATA_TYPE, ACTION_TYPES, CATEGORY_TYPE)(deleteData)).then(() => {
			let actions = store.getActions();

			let actionDelete = _.find(actions, (action) => action.type === ACTION_TYPES.MARK_DELETED);
			let actionRemoveEditedProperty = _.find(actions, (action) => action.type === ACTION_TYPES.INDEX.CLEAR_INDEX);

			//expect
			expect(actions).toHaveLength(2);

			expect(actionDelete).toBeDefined();
			expect(actionDelete.key).toBe(2);
		expect(actionRemoveEditedProperty).toBeDefined();
		}).catch((err) => {
			fail(err);
		});
	});
});