import commonReducers from "../../../../state/_common/reducers";
import {BASIC_STATE, EMPTY_EDITED_MODELS_STATE, NO_EDITED_MODELS_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('Common Reducers', () => {
	describe('#updateEdited', () => {
		it('should add new model to edited', () => {
			const action = {
				data: [{
					key: 3,
					data: {
						name: "Brno"
					}
				}]
			};
			const expectedState = {
				...BASIC_STATE.sample,
				editedByKey: {
					...BASIC_STATE.sample.editedByKey,
					3: {
						key: 3,
						data: {
							name: "Brno"
						}
					}
				}
			};
			expect(commonReducers.updateEdited(BASIC_STATE.sample, action)).toEqual(expectedState);
		});

		it('should update existing models in edited', () => {
			const action = {
				data: [{
					key: 1,
					data: {
						name: "Celý svět"
					}
				}, {
					key: 'nejake-nahodne-uuid',
					data: {
						name: "Gisat s.r.o",
						description: "Budova ve dvoře"
					}
				}]
			};
			const expectedState = {
				...BASIC_STATE.sample,
				editedByKey: {
					1: {
						key: 1,
						data: {
							name: "Celý svět",
							description: "..."
						}
					},
					4: {
						key: 4,
						data: {
							name: "Česko"
						}
					},
					'nejake-nahodne-uuid': {
						key: 'nejake-nahodne-uuid',
						data: {
							name: "Gisat s.r.o",
							description: "Budova ve dvoře"
						}
					}
				}
			};
			expect(commonReducers.updateEdited(BASIC_STATE.sample, action)).toEqual(expectedState);
		});

		it('should add first set of updated data', () => {
			const action = {
				data: [{
					key: 1,
					data: {
						name: "Praha"
					}
				}]
			};
			
			const expectedState = {
				...NO_EDITED_MODELS_STATE.sample,
				editedByKey: {
					1: {
						key: 1,
						data: {
							name: "Praha"
						}
					},
				}
			};
			expect(commonReducers.updateEdited(NO_EDITED_MODELS_STATE.sample, action)).toEqual(expectedState);
		});
	});
});