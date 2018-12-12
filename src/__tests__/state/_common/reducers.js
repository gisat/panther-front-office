import commonReducers from '../../../state/_common/reducers';

const BASIC_STATE = {
	activeKey: 1,
	byKey: {
		1: {
			key: 1,
			data: {
				name: "Prague",
				description: null
			}
		},
		2: {
			key: 2,
			data: {
				name: "Pilsen",
				description: "Soutok čtyř řek."
			}
		},
		3: {
			key: 3,
			data: {
				name: "Brno"
			}
		}
	},
	editedByKey: {
		1: {
			key: 1,
			data: {
				description: "Matka měst"
			}
		},
		2: {
			key: 2,
			data: {
				name: "Pilsen",
				description: "Město piva"
			}
		}
	}
};

describe('Common Reducers', () => {
	describe('#setActive', () => {
		it('should set active key', () => {
			const action = {
				key: 2
			};
			const expectedState = {
				...BASIC_STATE,
				activeKey: 2,
				activeKeys: null
			};
			expect(commonReducers.setActive(BASIC_STATE, action)).toEqual(expectedState);
		});

		it('should set active key to null', () => {
			const action = {
				key: null
			};
			const expectedState = {
				...BASIC_STATE,
				activeKey: null,
				activeKeys: null
			};
			expect(commonReducers.setActive(BASIC_STATE, action)).toEqual(expectedState);
		});
	});

	describe('#setActiveMultiple', () => {
		it('should set active keys', () => {
			const action = {
				keys: [1,2]
			};
			const expectedState = {
				...BASIC_STATE,
				activeKey: null,
				activeKeys: [1,2]
			};
			expect(commonReducers.setActiveMultiple(BASIC_STATE, action)).toEqual(expectedState);
		});

		it('should set active keys to null', () => {
			let state = {
				...BASIC_STATE,
				activeKey: null,
				activeKeys: [1,2]
			};
			const action = {
				keys: null
			};
			const expectedState = {
				...BASIC_STATE,
				activeKey: null,
				activeKeys: null
			};
			expect(commonReducers.setActiveMultiple(state, action)).toEqual(expectedState);
		});

		it('should change active keys', () => {
			let state = {...BASIC_STATE,
				activeKey: null,
				activeKeys: [1, 2]
			};
			const action = {
				keys: [2, 3]
			};
			const expectedState = {
				...BASIC_STATE,
				activeKey: null,
				activeKeys: [2, 3]
			};
			expect(commonReducers.setActiveMultiple(state, action)).toEqual(expectedState);
		});
	});

	describe('#updateEdited', () => {
		it('should add new model to edited', () => {
			const action = {
				data: [{key: 3, data: {name: "Brno"}}]
			};
			const expectedState = {
				...BASIC_STATE,
				editedByKey: {
					...BASIC_STATE.editedByKey,
					3: {key: 3, data: {name: "Brno"}}
				}
			};
			expect(commonReducers.updateEdited(BASIC_STATE, action)).toEqual(expectedState);
		});
		it('should update existing models in edited', () => {
			const action = {
				data: [{key: 1, data: {name: "Praha"}},{key: 2, data: {name: "Plzeň", description: "Ahoj"}}]
			};
			const expectedState = {
				...BASIC_STATE,
				editedByKey: {
					...BASIC_STATE.editedByKey,
					1: {key: 1, data: {name: "Praha", description: "Matka měst"}},
					2: {key: 2, data: {name: "Plzeň", description: "Ahoj"}}
				}
			};
			expect(commonReducers.updateEdited(BASIC_STATE, action)).toEqual(expectedState);
		});
		it('should add first set of updated data', () => {
			const state = {
				...BASIC_STATE,
				editedByKey: null
			};
			const action = {
				data: [{key: 1, data: {name: "Praha"}}]
			};
			const expectedState = {
				...BASIC_STATE,
				editedByKey: {
					1: {key: 1, data: {name: "Praha"}},
				}
			};
			expect(commonReducers.updateEdited(state, action)).toEqual(expectedState);
		});
	});
});