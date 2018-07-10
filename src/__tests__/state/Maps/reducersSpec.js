import ActionTypes from '../../../constants/ActionTypes';
import mapsReducer from '../../../state/Maps/reducers';
import {Reducer} from 'redux-testkit';

let state = {
	defaults: null
};

// todo solve issue with window
describe('Maps Reducers', () => {
	it('update navigator in defauts', () => {
		const expectedResult = {
			defaults: {
				navigator: {
					lookAtLocation: {
						longitude: 150,
						latitude: 30
					},
					range: 3333
				}
			}
		};
		const action = {
			type: ActionTypes.MAPS_UPDATE_DEFAULTS,
			data: {
				navigator: {
					lookAtLocation: {
						longitude: 150,
						latitude: 30
					},
					range: 3333
				}
			}
		};
		Reducer(mapsReducer).withState(state).expect(action).toReturnState(expectedResult);
	});
});