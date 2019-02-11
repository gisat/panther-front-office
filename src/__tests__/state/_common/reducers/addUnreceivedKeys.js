import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, NO_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#addUnreceivedKeys', () => {
	it('should add unreceived keys to epty state', () => {
		const action = {
			keys: ['aaa', 'bbb']
		};
		const expectedState = {
			...NO_MODELS_STATE.sample,
			byKey: {
				aaa: {
					key: 'aaa',
					unreceived: true
				},
				bbb: {
					key: 'bbb',
					unreceived: true
				}
			}
		};
		expect(commonReducers.addUnreceivedKeys(NO_MODELS_STATE.sample, action)).toEqual(expectedState);
	});

	it('should add unreceived keys to existing object', () => {
		const action = {
			keys: ['aaa', 'bbb']
		};
		const expectedState = {
			...BASIC_STATE.sample,
			byKey: {
				...BASIC_STATE.sample.byKey,
				aaa: {
					key: 'aaa',
					unreceived: true
				},
				bbb: {
					key: 'bbb',
					unreceived: true
				}
			}
		};
		expect(commonReducers.addUnreceivedKeys(BASIC_STATE.sample, action)).toEqual(expectedState);
	});
});