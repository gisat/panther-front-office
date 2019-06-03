import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';


import commonActions from "../../../../state/_common/actions";
import {getSubstate, getState} from "../../../../__testUtils/sampleStates/_common";
import SampleActionTypes from "../../../../__testUtils/SampleActionTypes";

// mock module with empty function (it will be reimplemented for each test)
jest.mock('../../../../state/Action');
jest.mock('../../../../state/_common/request', () => {return jest.fn(() => {})});

const ACTION_TYPES = SampleActionTypes.SAMPLE;
const DATA_TYPE = 'sample';
const CATEGORY_TYPE = 'metadata';


describe('#apiCreate', () => {
	const mockStore = configureMockStore([thunk]);

	it('should create item', () => {
		// mock store
		const store = mockStore(getState());

		// test input parameters
		const key = 1;
		const appKey = 'app';

		// mock expected endpoint response
		const request = require('../../../../state/_common/request');
		request.mockImplementation(() => {
			return Promise.resolve({
				data: {
					[DATA_TYPE]: [{
						key: key,
						data: { //created data
							applicationKey: appKey,
							description: "...",
						}
					}]
				}
			});
		});
		return store.dispatch(commonActions.create(getSubstate, DATA_TYPE, ACTION_TYPES, CATEGORY_TYPE)(key, appKey)).then(() => {
			let actions = store.getActions();

			let actionAdd = _.find(actions, (action) => action.type === ACTION_TYPES.ADD);
			let actionClearIndex = _.find(actions, (action) => action.type === ACTION_TYPES.INDEX.CLEAR_INDEX);

			//expect
			expect(actions).toHaveLength(2);

			expect(actionAdd).toBeDefined();
			expect(actionAdd.data[0].key).toBe(key);
			expect(actionAdd.data[0].data.applicationKey).toBe(appKey);
			expect(actionClearIndex).toBeDefined();
		}).catch((err) => {
			fail(err);
		});
	});
});