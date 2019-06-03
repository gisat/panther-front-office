import _ from 'lodash';
import ActionTypes from '../../../../constants/ActionTypes';
import screensReducer from '../../../../state/Screens/reducers';

import {BASIC_STATE, INITIAL_STATE} from "../../../../__testUtils/sampleStates/screens";

describe('Screens/reducers#add', () => {
	it('Should add new screen', () => {
		const originalState = _.cloneDeep(INITIAL_STATE.screens);
		const action = {
			type: ActionTypes.SCREENS.ADD,
			setKey: 'Set1',
			lineage: 'Set1-ScreenA',
			data: {
				desiredState: 'open'
			}
		};

		const expectedResult = {
			screens: {
				'Set1-ScreenA' : {
					lineage: 'Set1-ScreenA',
					data: {
						desiredState: 'open',
						minActiveWidth: null,
						width: null
					}
				}
			},
			sets: {
				Set1: {
					orderByHistory: ['Set1-ScreenA'],
					orderBySpace: ['Set1-ScreenA']
				}
			}
		};

		expect(screensReducer(INITIAL_STATE.screens, action)).toEqual(expectedResult);
		// check immutability
		expect(INITIAL_STATE.screens).toEqual(originalState);
	});
});