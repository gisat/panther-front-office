import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import _ from 'lodash';

import Action from  '../../../state/Action';
import ActionTypes from  '../../../constants/ActionTypes';
import commonActions from '../../../state/_common/actions';

const mockStore = configureMockStore([thunk]);

const INITIAL_STATE = {
	components: {
		application: {
			intro: true,
			style: {
				activeKey: null,
				configuration: {
					forScope: {
						htmlClass: null
					},
					forUrl: {
						htmlClass: null
					}
				}
			}
		}
	}
};

describe('Components Actions', () => {
	describe('#setApplicationStyleActiveKey', () => {
		it('should dispatch update action', () => {
			const store = mockStore(INITIAL_STATE);
			const key = 'dromas';
			const expectedData = {
				style: {
					activeKey: 'dromas',
					configuration: {
						forScope: {
							htmlClass: null
						},
						forUrl: {
							htmlClass: null
						}
					}
				}
			};

			const expectedActions = [{
				type: ActionTypes.COMPONENTS_UPDATE,
				component: 'application',
				update: expectedData
			}];
			store.dispatch(Action.components.setApplicationStyleActiveKey(key));
			expect(store.getActions()).toEqual(expectedActions);
		});
	});

	describe('#setApplicationStyleHtmlClass', () => {
		it('should dispatch update action', () => {
			const store = mockStore(INITIAL_STATE);
			const configuration = 'forUrl';
			const htmlClass = 'dromas';
			const expectedData = {
				style: {
					activeKey: null,
					configuration: {
						forScope: {
							htmlClass: null
						},
						forUrl: {
							htmlClass: 'dromas'
						}
					}
				}
			};

			const expectedActions = [{
				type: ActionTypes.COMPONENTS_UPDATE,
				component: 'application',
				update: expectedData
			}];
			store.dispatch(Action.components.setApplicationStyleHtmlClass(configuration, htmlClass));
			expect(store.getActions()).toEqual(expectedActions);
		});
	});
});