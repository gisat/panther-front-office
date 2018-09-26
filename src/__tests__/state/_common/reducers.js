import commonReducers from '../../../state/_common/reducers';

describe('Common Reducers', () => {
	describe('#setActive', () => {
		it('should set active key', () => {
			let state = {
				activeKeys: [2, 3],
				activeKey: null
			};
			const action = {
				key: 2
			};
			const expectedState = {
				activeKeys: null,
				activeKey: 2
			};
			expect(commonReducers.setActive(state, action)).toMatchObject(expectedState);
		});

		it('should set active key to null', () => {
			let state = {
				activeKeys: null,
				activeKey: 2
			};
			const action = {
				key: null
			};
			const expectedState = {
				activeKeys: null,
				activeKey: null
			};
			expect(commonReducers.setActive(state, action)).toMatchObject(expectedState);
		});

		it('should change active key', () => {
			let state = {
				activeKeys: null,
				activeKey: 2
			};
			const action = {
				key: 3
			};
			const expectedState = {
				activeKeys: null,
				activeKey: 3
			};
			expect(commonReducers.setActive(state, action)).toMatchObject(expectedState);
		});
	});

	describe('#setActiveMultiple', () => {
		it('should set active keys', () => {
			let state = {
				activeKeys: null,
				activeKey: 3
			};
			const action = {
				keys: [1,2]
			};
			const expectedState = {
				activeKeys: [1,2],
				activeKey: null
			};
			expect(commonReducers.setActiveMultiple(state, action)).toMatchObject(expectedState);
		});

		it('should set active keys to null', () => {
			let state = {
				activeKeys: [2, 3],
				activeKey: null
			};
			const action = {
				keys: null
			};
			const expectedState = {
				activeKeys: null,
				activeKey: null
			};
			expect(commonReducers.setActiveMultiple(state, action)).toMatchObject(expectedState);
		});

		it('should change active keys', () => {
			let state = {
				activeKeys: [2, 3],
				activeKey: null
			};
			const action = {
				keys: [2, 4]
			};
			const expectedState = {
				activeKeys: [2, 4],
				activeKey: null
			};
			expect(commonReducers.setActiveMultiple(state, action)).toMatchObject(expectedState);
		});
	});

	describe('#add', () => {
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
			expect(commonReducers.add(initialState, action)).toEqual(expectedState);
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
			expect(commonReducers.add(state, action)).toEqual(expectedState);
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
			expect(commonReducers.add(state2, action)).toEqual(expectedState);
		});
	});

	describe('#remove', () => {
		const INITIAL_STATE = {
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
						name: "Brno"
					}
				}
			}
		};
		it('should remove models', () => {
			const action = {
				keys: [2, 3]
			};
			const expectedState = {
				byKey: {
					1: {
						key: 1,
						data: {
							name: "Prague"
						}
					}
				}
			};
			expect(commonReducers.remove(INITIAL_STATE, action)).toEqual(expectedState);
		});
		it('should not remove any model', () => {
			const action = {
				keys: null
			};
			const expectedState = {...INITIAL_STATE};
			expect(commonReducers.remove(INITIAL_STATE, action)).toEqual(expectedState);
		});
		it('should not modify byKey, if it is null', () => {
			const action = {
				keys: [1, 2]
			};
			const nullState = {
				byKey: null
			};
			const expectedState = {
				byKey: null
			};
			expect(commonReducers.remove(nullState, action)).toEqual(expectedState);
		});
	});
});