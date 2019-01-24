import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

import Action from  '../../../../state/Action';
import ActionTypes from  '../../../../constants/ActionTypes';

const mockStore = configureMockStore([thunk]);

const INITIAL_STATE = {
	maps: {
		activeSetKey: null,
		activeMapKey: null,
		maps: {},
		sets: {}
	}
};

describe('Maps Actions', () => {
	describe('#setActiveMapKey', () => {
		it('should dispatch update action', () => {
			const store = mockStore(INITIAL_STATE);

			const expectedActions = [{
				type: ActionTypes.MAPS.SET_ACTIVE_MAP_KEY,
				mapKey: 'map1',
			}];
			store.dispatch(Action.maps.setActiveMapKey('map1'));
			expect(store.getActions()).toEqual(expectedActions);
		});
	});
});