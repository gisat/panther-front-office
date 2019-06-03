import Select from '../../../../state/Select';
import {Selector} from 'redux-testkit';

const INITIAL_STATE = {
	places: {
		activeKey: 1
	},
	scenarios: {
		cases: {
			activeKey: 2,
			byKey: {
				2: {
					key: 2,
					data: {
						place_ids: [1],
						scenarios: [10,11],
						scenariosLoaded: true
					}
				},
				3: {
					key: 3,
					data: {
						place_ids: [2],
						scenarios: [12,13,14],
						scenariosLoaded: false
					}
				},
				4: {
					key: 4,
					data: {
						place_ids: [1],
						scenarios: [15],
						scenariosLoaded: false
					}
				},
				5: {
					key: 5,
					data: {
						place_ids: [3]
					}
				},
			},
			editedByKey: {
				2: {
					key: 2,
					data: {
						name: "Case A",
						scenarios: [10,11,'uuid-123']
					}
				},
				4: {
					key: 4,
					data: {
						description: "Popis"
					}
				}
			}
		},
		scenarios: {
			byKey: {
				10: {
					key: 10,
					data: {
						name: "Scenario 10"
					}
				},
				11: {
					key: 11,
					data: {
						name: "Scenario 11"
					}
				},
				12: {
					key: 12,
					data: {
						name: "Scenario 12"
					}
				},
			},
			editedByKey: {
				10: {
					key: 10,
					data: {
						description: "popis scénáře"
					}
				},
				12: {
					key: 12,
					data: {
						name: "Scénář 12",
						description: "popis scénáře 12"
					}
				},
				'uuid-123': {
					key: 'uuid-123',
					data: {
						name: "New scenario",
					}
				}
			}
		}
	}
};

describe('Scenario cases selectors', () => {
	describe('#activeCaseScenariosLoaded', () => {
		it('should select true, if scenariosLoaded parameter has true as value for active case', () => {
			let selector = Selector(Select.scenarios.cases.activeCaseScenariosLoaded).execute(INITIAL_STATE);
			expect(selector).toBeTruthy();
		});
		it('should select false, if scenariosLoaded parameter has false as value for active case', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: 3}}};
			let selector = Selector(Select.scenarios.cases.activeCaseScenariosLoaded).execute(state);
			expect(selector).toBeFalsy();
		});
		it('should select false, if there are no data for active case', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: 333}}};
			let selector = Selector(Select.scenarios.cases.activeCaseScenariosLoaded).execute(state);
			expect(selector).toBeFalsy();
		});
		it('should select false, if there is no active case', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: null}}};
			let selector = Selector(Select.scenarios.cases.activeCaseScenariosLoaded).execute(state);
			expect(selector).toBeFalsy();
		});
	});

	describe('#getActiveCaseScenarioKeys', () => {
		it('should select scenario keys of active case', () => {
			const expectedResult = [10, 11];
			Selector(Select.scenarios.cases.getActiveCaseScenarioKeys).expect(INITIAL_STATE).toReturn(expectedResult);
		});
		it('should return null, if there are no scenario keys of active case', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: 5}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenarioKeys).execute(state);
			expect(selector).toBeNull();
		});
		it('should return null, if there is no active case', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: null}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenarioKeys).execute(state);
			expect(selector).toBeNull();
		});
	});

	describe('#getActiveCaseEditedScenarioKeys', () => {
		it('should select scenario keys of active case edited model', () => {
			const expectedResult = [10,11,'uuid-123'];
			Selector(Select.scenarios.cases.getActiveCaseEditedScenarioKeys).expect(INITIAL_STATE).toReturn(expectedResult);
		});
		it('should return null, if there are no scenario keys of active case edited model', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: 5}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseEditedScenarioKeys).execute(state);
			expect(selector).toBeNull();
		});
		it('should return null, if there is no active case', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: null}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseEditedScenarioKeys).execute(state);
			expect(selector).toBeNull();
		});
	});

	describe('#getActiveCaseScenarios', () => {
		it('should select scenario models for active case', () => {
			const expectedResult = [{key: 10, data: {name: "Scenario 10"}}, {key: 11, data: {name: "Scenario 11"}}];
			Selector(Select.scenarios.cases.getActiveCaseScenarios).expect(INITIAL_STATE).toReturn(expectedResult);
		});
		it('should return null, if there are no scenario keys of active case', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: 5}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenarios).execute(state);
			expect(selector).toBeNull();
		});
		it('should return null, if there are no models for active case scenario keys', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: 4}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenarios).execute(state);
			expect(selector).toBeNull();
		});
		it('should return null, if there is no active case', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: null}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenarios).execute(state);
			expect(selector).toBeNull();
		});
	});

	describe('#getActiveCaseScenariosEditedKeys', () => {
		it('should select keys of edited scenarios for active case', () => {
			const expectedResult = [10];
			Selector(Select.scenarios.cases.getActiveCaseScenariosEditedKeys).expect(INITIAL_STATE).toReturn(expectedResult);
		});
		it('should return null, if there are no scenario keys of active case', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: 5}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenariosEditedKeys).execute(state);
			expect(selector).toBeNull();
		});
		it('should return null, if there are no edited models for active case scenario keys', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: 4}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenariosEditedKeys).execute(state);
			expect(selector).toBeNull();
		});
		it('should return null, if there is no active case', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: null}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenariosEditedKeys).execute(state);
			expect(selector).toBeNull();
		});
		it('should return null, if there are no edited scenarios', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, scenarios: {...INITIAL_STATE.scenarios.scenarios, editedByKey: null}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenariosEditedKeys).execute(state);
			expect(selector).toBeNull();
		});
	});

	describe('#getActiveCaseScenariosEdited', () => {
		it('should select edited scenarios for active case', () => {
			const expectedResult = [{key: 10, data: {description: "popis scénáře"}}, {
				key: 'uuid-123',
				data: {
					name: "New scenario",
				}
			}];
			Selector(Select.scenarios.cases.getActiveCaseScenariosEdited).expect(INITIAL_STATE).toReturn(expectedResult);
		});
		it('should return null, if there are no scenario keys of active case', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: 5}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenariosEdited).execute(state);
			expect(selector).toBeNull();
		});
		it('should return null, if there are no edited models for active case scenario keys', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: 4}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenariosEdited).execute(state);
			expect(selector).toBeNull();
		});
		it('should return null, if there are no edited scenarios', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, scenarios: {...INITIAL_STATE.scenarios.scenarios, editedByKey: null}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenariosEdited).execute(state);
			expect(selector).toBeNull();
		});
		it('should return null, if there is no active case', () => {
			const state = {...INITIAL_STATE, scenarios: {...INITIAL_STATE.scenarios, cases: {...INITIAL_STATE.scenarios.cases, activeKey: null}}};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenariosEdited).execute(state);
			expect(selector).toBeNull();
		});
		it('should select edited scenarios for scenarios keys in editedByKey only, if there are no scenario keys in byKey for active case', () => {
			const state = {
				...INITIAL_STATE, scenarios: {
					...INITIAL_STATE.scenarios, cases: {
						...INITIAL_STATE.scenarios.cases, byKey: {
							...INITIAL_STATE.scenarios.cases.byKey, 2: {
								key: 2,
								data: {
									scenarios: null
								}
							}
						}
					}
				}
			};
			const expectedResult = [{
				key: 10,
				data: {
					description: "popis scénáře"
				}
			}, {
				key: 'uuid-123',
				data: {
					name: "New scenario",
				}
			}];
			Selector(Select.scenarios.cases.getActiveCaseScenariosEdited).expect(state).toReturn(expectedResult);
		});
		it('should select edited scenarios for scenarios keys in byKey only, if there are no scenario keys in editedByKey for active case', () => {
			const state = {
				...INITIAL_STATE, scenarios: {
					...INITIAL_STATE.scenarios, cases: {
						...INITIAL_STATE.scenarios.cases, editedByKey: {
							...INITIAL_STATE.scenarios.cases.editedByKey, 2: {
								key: 2,
								data: {
									scenarios: null
								}
							}
						}
					}
				}
			};
			const expectedResult = [{
				key: 10,
				data: {
					description: "popis scénáře"
				}
			}];
			Selector(Select.scenarios.cases.getActiveCaseScenariosEdited).expect(state).toReturn(expectedResult);
		});
		it('should select null, if there are no scenario keys in byKey as well as in editedByKey for active case', () => {
			const state = {
				...INITIAL_STATE, scenarios: {
					...INITIAL_STATE.scenarios, cases: {
						...INITIAL_STATE.scenarios.cases,
						editedByKey: {
							...INITIAL_STATE.scenarios.cases.editedByKey, 2: {
								key: 2,
								data: {
									scenarios: null
								}
							}
						},
						byKey: {
							...INITIAL_STATE.scenarios.cases.byKey, 2: {
								key: 2,
								data: {
									scenarios: null
								}
							}
						}

					}
				}
			};
			let selector = Selector(Select.scenarios.cases.getActiveCaseScenariosEdited).execute(state);
			expect(selector).toBeNull();
		});
	});

	describe('#getActivePlaceCases', () => {
		it('should select all cases for active place', () => {
			const expectedResult = [{
				key: 2,
				data: {
					place_ids: [1],
					scenarios: [10, 11],
					scenariosLoaded: true
				}
			}, {
				key: 4,
				data: {
					place_ids: [1],
					scenarios: [15],
					scenariosLoaded: false
				}
			}];
			Selector(Select.scenarios.cases.getActivePlaceCases).expect(INITIAL_STATE).toReturn(expectedResult);
		});
		it('should return empty array, if there is no case for active place', () => {
			const state = {...INITIAL_STATE, places: {activeKey: 999}};
			let selector = Selector(Select.scenarios.cases.getActivePlaceCases).execute(state);
			expect(selector).toHaveLength(0);
		});
		it('should return empty array, if there is no active place', () => {
			const state = {...INITIAL_STATE, places: {activeKey: null}};
			let selector = Selector(Select.scenarios.cases.getActivePlaceCases).execute(state);
			expect(selector).toHaveLength(0);
		});
	});
});