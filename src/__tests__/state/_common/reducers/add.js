import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, NO_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#add', () => {
	it('should add an initial set of data', () => {
		const action = {
			data: [{
				key: 4,
				data: {
					name: "Ostrava"
				}
			}, {
				key: 5,
				data: {
					name: "Liberec"
				}
			}]
		};
		const expectedState = {
			...NO_MODELS_STATE.sample,
			byKey: {
				4: {
					key: 4,
					data: {
						name: "Ostrava"
					}
				},
				5: {
					key: 5,
					data: {
						name: "Liberec"
					}
				}
			}
		};
		expect(commonReducers.add(NO_MODELS_STATE.sample, action)).toEqual(expectedState);
	});

	it('should add new data to existing object', () => {
		const action = {
			data: [{
				key: 11,
				data: {
					name: "Ostrava"
				}
			}]
		};
		const expectedState = {
			...BASIC_STATE.sample,
			byKey: {
				...BASIC_STATE.sample.byKey,
				11: {
					key: 11,
					data: {
						name: "Ostrava"
					}
				}
			}
		};
		expect(commonReducers.add(BASIC_STATE.sample, action)).toEqual(expectedState);
	});

	it('should add existing data to existing object', () => {
		const action = {
			data: [{
				key: 1,
				data: {
					name: "Svět"
				}
			}]
		};
		const expectedStateFragment = {
			key: 1,
			data: {
				name: "Svět"
			},
			permissions: {
				activeUser: {get: true, update: true, delete: true},
				guest: {get: true, update: false, delete: false}
			}
		};

		let result = commonReducers.add(BASIC_STATE.sample, action);
		expect(result.byKey[1]).toEqual(expectedStateFragment);
	});
});