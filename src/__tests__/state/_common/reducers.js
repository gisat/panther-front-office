import commonReducers from '../../../state/_common/reducers';

describe('Common Reducers', () => {
	describe('#setActiveMultiple', () => {
		let state = {
			activeKeys: null,
			activeKey: 3
		};

		it('should set active keys', () => {
			const action = {
				keys: [1,2]
			};
			const expectedState = {
				activeKeys: [1,2],
				activeKey: null
			};
			expect(commonReducers.setActiveMultiple(state, action)).toMatchObject(expectedState);
		});
	});

	describe('#addByKey', () => {
		let initialState = {
			activeKey: null,
			byKey: null
		};

		let state = {
			activeKey: 1,
			byKey: {
				1: {
					key: 1,
					data: {
						name: "Prague"
					}
				},
				2: {
					key: 2,
					data: {
						name: "Pilsen"
					}
				}
			}
		};
		let state2 = {
			activeKey: 1,
			byKey: {
				1: {
					key: 1,
					data: {
						name: "Prague"
					}
				}
			}
		};

		it('should add first set of data', () => {
			const action = {
				data: [{key: 1, data: {name: "Brno"}}, {key: 2, data: {name: "Liberec"}}]
			};
			const expectedState = {
				activeKey: null,
				byKey: {
					1: {
						key: 1,
						data: {
							name: "Brno"
						}
					},
					2: {
						key: 2,
						data: {
							name: "Liberec"
						}
					}
				}
			};
			expect(commonReducers.addByKey(initialState, action)).toEqual(expectedState);
		});

		it('should add new objects to existing data', () => {
			const action = {
				data: [{key: 3, data: {name: "Ostrava"}}, {key: 4, data: {name: "Brno"}}]
			};
			const expectedState = {
				activeKey: 1,
				byKey: {
					1: {
						key: 1,
						data: {
							name: "Prague"
						}
					},
					2: {
						key: 2,
						data: {
							name: "Pilsen"
						}
					},
					3: {
						key: 3,
						data: {
							name: "Ostrava"
						}
					},
					4: {
						key: 4,
						data: {
							name: "Brno"
						}
					}
				}
			};
			expect(commonReducers.addByKey(state, action)).toEqual(expectedState);
		});

		it('should change data in existing object', () => {
			const action = {
				data: [{key: 1, data: {name: "Brno"}}]
			};
			const expectedState = {
				activeKey: 1,
				byKey: {
					1: {
						key: 1,
						data: {
							name: "Brno"
						}
					}
				}
			};
			expect(commonReducers.addByKey(state2, action)).toEqual(expectedState);
		});
	});
});