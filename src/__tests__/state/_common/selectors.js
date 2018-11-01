import _ from 'lodash';
import commonSelectors from '../../../state/_common/selectors';

const INITIAL_STATE = {
	activeKey: 1,
	byKey: {
		1: {
			key: 1,
			data: {
				name: "World"
			}
		},
		2: {
			key: 2,
			data: {
				name: "Europe"
			}
		}
	},
	editedByKey: {
		1: {
			key: 1,
			data: {
				name: "Svět"
			}
		},
		2: {
			key: 2,
			data: {
				name: "Evropa"
			}
		}
	},
	indexes: [
		{
			order: null,
			filter: {
				scope: 2,
			},
			count: 10,
			index: {1: 1, 2: 2, 3: 3}
		}, {
			order: [['name', 'ascending']],
			filter: {
				scope: 1,
			},
			count: 10,
			index: {1: 1, 2: 2, 3: 3, 7: 54, 8: 56, 9: 77, 10: 89}
		}, {
			order: null,
			filter: {
				scope: 1,
				date: {
					start: '2018-09-17T13:45:03Z',
					end: '2018-09-17T13:45:04Z'
				},
			},
			count: 10,
			index: {1: 1, 2: 2, 3: 3}
		}
	]
};

const NO_ACTIVE_KEY_STATE = {
	activeKey: null,
	byKey: {
		1: {
			name: "Test"
		}
	},
	editedByKey: {
		1: {
			name: "Testík"
		}
	}
};

const NO_DATA_STATE = {
	byKey: null,
	editedByKey: null
};

const EMPTY_DATA_STATE = {
	byKey: {},
	editedByKey: {}
};

const getSubstate = state => state;

describe('Common selectors', () => {
	describe('#getActive', () => {
		const noModelsState = {
			activeKey: 1,
			byKey: null
		};
		const expectedOutput = {
			key: 1,
			data: {
				name: "World"
			}
		};

		it('should select active data from state', () => {
			expect(commonSelectors.getActive(getSubstate)(INITIAL_STATE)).toEqual(expectedOutput);
		});
		it('should select undefined, when byKey do not exist', () => {
			expect(commonSelectors.getActive(getSubstate)(noModelsState)).toBeNull();
		});
		it('should select undefined, when active key is null', () => {
			expect(commonSelectors.getActive(getSubstate)(NO_ACTIVE_KEY_STATE)).toBeUndefined();
		});
	});

	describe('#getActiveModels', () => {
		const fullState = {
			byKey: {
				1: {
					key: 1,
					data: {
						name: "World"
					}
				},
				2: {
					key: 2,
					data: {
						name: "Europe"
					}
				},
				3: {
					key: 3,
					data: {
						name: "Italy"
					}
				}
			},
			activeKeys: [1, 3]
		};
		const nullState = {...fullState, activeKeys: null};
		const missingModelState = {...fullState, activeKeys: [1, 3, 5]};
		const noModelsState = {...fullState, byKey: null};
		const emptyModelsState = {...fullState, byKey: {}};

		const expectedOutput = [{
			key: 1,
			data: {
				name: "World"
			}
		}, {
			key: 3,
			data: {
				name: "Italy"
			}
		}];

		it('should select active models', () => {
			expect(commonSelectors.getActiveModels(getSubstate)(fullState)).toEqual(expectedOutput);
		});
		it('should select only existing models for active keys', () => {
			expect(commonSelectors.getActiveModels(getSubstate)(missingModelState)).toEqual(expectedOutput);
		});
		it('should select undefined, when active keys is null', () => {
			expect(commonSelectors.getActiveModels(getSubstate)(nullState)).toBeNull();
		});
		it('should select null, when byKey do not exist', () => {
			expect(commonSelectors.getActiveModels(getSubstate)(noModelsState)).toBeNull();
		});
		it('should select null, when byKey is empty object', () => {
			expect(commonSelectors.getActiveModels(getSubstate)(emptyModelsState)).toBeNull();
		});
	});

	describe('#getActiveKey', () => {
		it('should select active key', () => {
			expect(commonSelectors.getActiveKey(getSubstate)(INITIAL_STATE)).toBe(1);
		});
		it('should return null, when active key is not set', () => {
			expect(commonSelectors.getActiveKey(getSubstate)(NO_ACTIVE_KEY_STATE)).toBeNull();
		});
	});

	describe('#getActiveKeys', () => {
		const state = {
			activeKeys: [2, 3]
		};
		const nullState = {
			activeKeys: null
		};
		it('should select active keys', () => {
			expect(commonSelectors.getActiveKeys(getSubstate)(state)).toEqual([2, 3]);
		});
		it('should return null, when active keys is null', () => {
			expect(commonSelectors.getActiveKeys(getSubstate)(nullState)).toBeNull();
		});
	});

	describe('#getAll', () => {
		it('selected data shoud be in array, if exists', () => {
			expect(Array.isArray(commonSelectors.getAll(getSubstate)(INITIAL_STATE))).toBeTruthy();
			expect(Array.isArray(commonSelectors.getAll(getSubstate)(EMPTY_DATA_STATE))).toBeTruthy();
		});
		it('should select all models', () => {
			expect(commonSelectors.getAll(getSubstate)(INITIAL_STATE)).toHaveLength(2);
		});
		it('it should select null, if byKey does not exist', () => {
			expect(commonSelectors.getAll(getSubstate)(NO_DATA_STATE)).toBeNull();
		});
		it('it should select empty array, if byKey is empty object', () => {
			expect(commonSelectors.getAll(getSubstate)(EMPTY_DATA_STATE)).toHaveLength(0);
		});
	});

	describe('#getAllAsObject', () => {
		const expectedOutput = {
			1: {
				key: 1,
				data: {
					name: "World"
				}
			},
			2: {
				key: 2,
				data: {
					name: "Europe"
				}
			}
		};

		it('selected data should equal expected object', () => {
			expect(commonSelectors.getAllAsObject(getSubstate)(INITIAL_STATE)).toEqual(expectedOutput);
		});
		it('should select null, if data does not exist', () => {
			expect(commonSelectors.getAllAsObject(getSubstate)(NO_DATA_STATE)).toBeNull();
		});
		it('should select empty object, if data data is empty object', () => {
			let selection = commonSelectors.getAllAsObject(getSubstate)(EMPTY_DATA_STATE);
			expect(_.isEmpty(selection)).toBeTruthy();
		});
	});

	describe('#getByKey', () => {
		const expectedOutput = {
				key: 1,
				data: {
					name: "World"
				}
			};
		it('selected data should equal expected object', () => {
			expect(commonSelectors.getByKey(getSubstate)(INITIAL_STATE, 1)).toEqual(expectedOutput);
		});
		it('should select null, if data does not exist', () => {
			expect(commonSelectors.getByKey(getSubstate)(NO_DATA_STATE, 1)).toBeNull();
		});
	});

	describe('#getEditedActive', () => {
		const noModelsState = {
			activeKey: 1,
			byKey: null,
			editedByKey: null
		};
		const expectedOutput = {
			key: 1,
			data: {
				name: "Svět"
			}
		};

		it('should select active edited data from state', () => {
			expect(commonSelectors.getEditedActive(getSubstate)(INITIAL_STATE)).toEqual(expectedOutput);
		});
		it('should select null, when byKey do not exist', () => {
			expect(commonSelectors.getEditedActive(getSubstate)(noModelsState)).toBeNull();
		});
		it('should select undefined, when active key is null', () => {
			expect(commonSelectors.getEditedActive(getSubstate)(NO_ACTIVE_KEY_STATE)).toBeUndefined();
		});
	});

	describe('#getEditedAll', () => {
		it('selected data shoud be in array, if exists', () => {
			expect(Array.isArray(commonSelectors.getEditedAll(getSubstate)(INITIAL_STATE))).toBeTruthy();
			expect(Array.isArray(commonSelectors.getEditedAll(getSubstate)(EMPTY_DATA_STATE))).toBeTruthy();
		});
		it('should select all edited data', () => {
			expect(commonSelectors.getEditedAll(getSubstate)(INITIAL_STATE)).toHaveLength(2);
		});
		it('it should select null, if byKey does not exist', () => {
			expect(commonSelectors.getEditedAll(getSubstate)(NO_DATA_STATE)).toBeNull();
		});
		it('it should select empty array, if byKey is empty object', () => {
			expect(commonSelectors.getEditedAll(getSubstate)(EMPTY_DATA_STATE)).toHaveLength(0);
		});
	});

	describe('#getEditedAllAsObject', () => {
		const expectedOutput = {
			1: {
				key: 1,
				data: {
					name: "Svět"
				}
			},
			2: {
				key: 2,
				data: {
					name: "Evropa"
				}
			}
		};

		it('selected data should equal expected object', () => {
			expect(commonSelectors.getEditedAllAsObject(getSubstate)(INITIAL_STATE)).toEqual(expectedOutput);
		});
		it('should select null, if data does not exist', () => {
			expect(commonSelectors.getEditedAllAsObject(getSubstate)(NO_DATA_STATE)).toBeNull();
		});
		it('should select empty object, if data data is empty object', () => {
			let selection = commonSelectors.getEditedAllAsObject(getSubstate)(EMPTY_DATA_STATE);
			expect(_.isEmpty(selection)).toBeTruthy();
		});
	});

	describe('#getEditedByKey', () => {
		const expectedOutput = {
			key: 1,
			data: {
				name: "Svět"
			}
		};
		it('selected data should equal expected object', () => {
			expect(commonSelectors.getEditedByKey(getSubstate)(INITIAL_STATE, 1)).toEqual(expectedOutput);
		});
		it('should select null, if data does not exist', () => {
			expect(commonSelectors.getEditedByKey(getSubstate)(NO_DATA_STATE, 1)).toBeNull();
		});
	});

	describe('#getEditedKeys', () => {
		const expectedOutput = [1, 2];
		it('selected data should equal expected object', () => {
			expect(commonSelectors.getEditedKeys(getSubstate)(INITIAL_STATE)).toEqual(expectedOutput);
		});
		it('should select null, if data does not exist', () => {
			expect(commonSelectors.getEditedKeys(getSubstate)(NO_DATA_STATE)).toBeNull();
		});
		it('should select null, if editedByKey is empty object', () => {
			expect(commonSelectors.getEditedKeys(getSubstate)(EMPTY_DATA_STATE)).toBeNull();
		});
	});

	describe('#getIndex', () => {
		it('should select index', () => {
			let filter = {scope: 1};
			let order = [['name', 'ascending']];
			let expectedResult = {
				order: [['name', 'ascending']],
				filter: {
					scope: 1,
				},
				count: 10,
				index: {1: 1, 2: 2, 3: 3, 7: 54, 8: 56, 9: 77, 10: 89}
			};
			expect(commonSelectors.getIndex(getSubstate)(INITIAL_STATE, filter, order)).toEqual(expectedResult);
		});

		it('should select 10 as index total', () => {
			let filter = null;
			let order = null;
			expect(commonSelectors.getIndex(getSubstate)(INITIAL_STATE, filter, order)).toBeNull();
		});
	});

	describe('#getIndexPage', () => {
		it('should select index', () => {
			let filter = {scope: 1};
			let order = [['name', 'ascending']];
			let start = 3;
			let length = 2;
			let expectedResult = {3: 3, 4: null};

			expect(commonSelectors.getIndexPage(getSubstate)(INITIAL_STATE, filter, order, start, length)).toEqual(expectedResult);
		});

		it('should select index', () => {
			let filter = {scope: 1};
			let order = [['name', 'ascending']];
			let start = 4;
			let length = 3;

			let expectedResult = {4: null, 5: null, 6: null};

			expect(commonSelectors.getIndexPage(getSubstate)(INITIAL_STATE, filter, order, start, length)).toEqual(expectedResult);
		});

		it('should select index', () => {
			let filter = {scope: 1};
			let order = [['name', 'ascending']];
			let start = 10;
			let length = 3;

			let expectedResult = {10: 89};

			expect(commonSelectors.getIndexPage(getSubstate)(INITIAL_STATE, filter, order, start, length)).toEqual(expectedResult);
		});
	});

	describe('#getIndexTotal', () => {
		it('should select 10 as index total', () => {
			let filter = {scope: 1};
			let order = [['name', 'ascending']];
			expect(commonSelectors.getIndexTotal(getSubstate)(INITIAL_STATE, filter, order)).toBe(10);
		});

		it('should select 10 as index total', () => {
			let filter = {scope: 2};
			let order = null;
			expect(commonSelectors.getIndexTotal(getSubstate)(INITIAL_STATE, filter, order)).toBe(10);
		});

		it('should select 10 as index total', () => {
			let filter = null;
			let order = null;
			expect(commonSelectors.getIndexTotal(getSubstate)(INITIAL_STATE, filter, order)).toBeNull();
		});
	});

	describe('#getKeysToLoad', () => {
		it('should select null if keys is null', () => {
			let keys = null;
			expect(commonSelectors.getKeysToLoad(getSubstate)(INITIAL_STATE, keys)).toEqual(null);
		});

		it('should select null if keys are empty array', () => {
			let keys = [];
			expect(commonSelectors.getKeysToLoad(getSubstate)(INITIAL_STATE, keys)).toEqual(null);
		});

		it('should select null if all keys are already loaded', () => {
			let keys = [1,2];
			expect(commonSelectors.getKeysToLoad(getSubstate)(INITIAL_STATE, keys)).toEqual(null);
		});

		it('should select all keys if there are no models loaded already', () => {
			let keys = [1,2];
			let state = {...INITIAL_STATE, byKey: null};
			expect(commonSelectors.getKeysToLoad(getSubstate)(state, keys)).toEqual([1,2]);
		});

		it('should select only unloaded keys', () => {
			let keys = [1,2,3,44];
			expect(commonSelectors.getKeysToLoad(getSubstate)(INITIAL_STATE, keys)).toEqual([3,44]);
		});
	});
});