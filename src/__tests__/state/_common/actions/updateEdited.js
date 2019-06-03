import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

import ActionTypes from "../../../../constants/ActionTypes";
import commonActions from "../../../../state/_common/actions";
import {getSubstate, BASIC_STATE} from "../../../../__testUtils/sampleStates/_common";
import SampleActionTypes from "../../../../__testUtils/SampleActionTypes";

jest.mock('../../../../state/Action');

describe('#updateEdited', () => {
	const mockStore = configureMockStore([thunk]);

	it('should dispatch action actionRemovePropertyFromEdited if edited property value is the same as original', () => {
		const store = mockStore({...BASIC_STATE});
		const actionTypes = SampleActionTypes.SAMPLE;

		const modelKey = 1;
		const key = 'name';
		const value = 'World';

		const expectedActions = [{
			type: SampleActionTypes.SAMPLE.EDITED.REMOVE_PROPERTY,
			key: modelKey,
			property: key
		}];

		store.dispatch(commonActions.updateEdited(getSubstate, actionTypes)(modelKey, key, value));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should dispatch action actionUpdateEdited if edited property value is different from original', () => {
		const store = mockStore({...BASIC_STATE});
		const actionTypes = SampleActionTypes.SAMPLE;

		const modelKey = 1;
		const key = 'name';
		const value = 'Svět';

		const expectedActions = [{
			type: SampleActionTypes.SAMPLE.EDITED.UPDATE,
			data: [{
				key: modelKey,
				data: {
					[key]: value
				}
			}]
		}];

		store.dispatch(commonActions.updateEdited(getSubstate, actionTypes)(modelKey, key, value));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should dispatch action actionUpdateEdited if original model does not exist', () => {
		const store = mockStore({...BASIC_STATE});
		const actionTypes = SampleActionTypes.SAMPLE;

		const modelKey = 99;
		const key = 'name';
		const value = 'Svět';

		const expectedActions = [{
			type: SampleActionTypes.SAMPLE.EDITED.UPDATE,
			data: [{
				key: modelKey,
				data: {
					[key]: value
				}
			}]
		}];

		store.dispatch(commonActions.updateEdited(getSubstate, actionTypes)(modelKey, key, value));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should dispatch general error action if getSubstate parameter is missing', () => {
		const store = mockStore({...BASIC_STATE});
		const expectedActions = [{
			type: 'ERROR',
		}];

		store.dispatch(commonActions.updateEdited(null, SampleActionTypes.SAMPLE)(1, 'name', 'Svět'));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should dispatch general error action if actionTypes parameter is missing', () => {
		const store = mockStore({...BASIC_STATE});
		const expectedActions = [{
			type: 'ERROR',
		}];

		store.dispatch(commonActions.updateEdited(getSubstate, null)(1, 'name', 'Svět'));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should dispatch general error action if updated model key is missing', () => {
		const store = mockStore({...BASIC_STATE});
		const expectedActions = [{
			type: 'ERROR',
		}];

		store.dispatch(commonActions.updateEdited(getSubstate, SampleActionTypes.SAMPLE)(null, 'name', 'Svět'));
		expect(store.getActions()).toEqual(expectedActions);
	});

	it('should dispatch general error action if property key parameter is missing', () => {
		const store = mockStore({...BASIC_STATE});
		const expectedActions = [{
			type: 'ERROR',
		}];

		store.dispatch(commonActions.updateEdited(getSubstate, SampleActionTypes.SAMPLE)(1, null, 'Svět'));
		expect(store.getActions()).toEqual(expectedActions);
	});
});