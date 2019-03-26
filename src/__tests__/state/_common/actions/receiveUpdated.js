import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

import ActionTypes from "../../../../constants/ActionTypes";
import commonActions from "../../../../state/_common/actions";
import {getSubstate, BASIC_STATE} from "../../../../__testUtils/sampleStates/_common";
import SampleActionTypes from "../../../../__testUtils/SampleActionTypes";

jest.mock('../../../../state/Action');

const ACTION_TYPES = SampleActionTypes.SAMPLE;
const DATA_TYPE = 'sample';

describe('#receiveUpdated', () => {
	const mockStore = configureMockStore([thunk]);

	it('should dispatch three actions if nothing changed while updating', () => {
		const store = mockStore({...BASIC_STATE});

		const data = {
			data: {
				[DATA_TYPE]: [{
					key: 1,
					data: {
						name: "Svět",
						description: "..."
					}
				}]
			}
		};

		const expectedActions = [{
			type: ACTION_TYPES.ADD,
			data: [...data.data[DATA_TYPE]]
		}, {
			type: ACTION_TYPES.EDITED.REMOVE_PROPERTY,
			key: 1,
			property: 'name'
		}, {
			type: ACTION_TYPES.EDITED.REMOVE_PROPERTY,
			key: 1,
			property: 'description'
		}, {
			filter: null,
			order: [["name", "ascending"]],
			type: ACTION_TYPES.INDEX.CLEAR_INDEX
		}];

		store.dispatch(commonActions.receiveUpdated(getSubstate, ACTION_TYPES, data, DATA_TYPE));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should dispatch two actions if description was changed while updating', () => {
		const store = mockStore({...BASIC_STATE});

		const data = {
			data: {
				[DATA_TYPE]: [{
					key: 1,
					data: {
						name: "Svět",
						description: "a"
					}
				}]
			}
		};

		const expectedActions = [{
			type: ACTION_TYPES.ADD,
			data: [...data.data[DATA_TYPE]]
		}, {
			type: ACTION_TYPES.EDITED.REMOVE_PROPERTY,
			key: 1,
			property: 'name'
		}, {
			filter: null,
			order: [["name", "ascending"]],
			type: ACTION_TYPES.INDEX.CLEAR_INDEX
		}];

		store.dispatch(commonActions.receiveUpdated(getSubstate, ACTION_TYPES, data, DATA_TYPE));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should not dispatch any action if data is empty for given data type', () => {
		const store = mockStore({...BASIC_STATE});

		const data = {
			data: {
				[DATA_TYPE]: []
			}
		};

		const expectedActions = [];

		store.dispatch(commonActions.receiveUpdated(getSubstate, ACTION_TYPES, data, DATA_TYPE));
		expect(store.getActions()).toEqual(expectedActions);
	});
});