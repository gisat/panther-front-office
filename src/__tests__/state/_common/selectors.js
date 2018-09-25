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
	}
};

const NO_ACTIVE_KEY_STATE = {
	activeKey: null,
	byKey: {
		1: {
			name: "Test"
		}
	}
};

const NO_DATA_STATE = {
	byKey: null
};

const EMPTY_DATA_STATE = {
	byKey: {}
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

		it('should select data about active scope from state', () => {
			expect(commonSelectors.getActive(getSubstate)(INITIAL_STATE)).toEqual(expectedOutput);
		});
		it('should select undefined, when byKey do not exist', () => {
			expect(commonSelectors.getActive(getSubstate)(noModelsState)).toBeNull();
		});
		it('should select undefined, when active key is null', () => {
			expect(commonSelectors.getActive(getSubstate)(NO_ACTIVE_KEY_STATE)).toBeUndefined();
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
		it('should select undefined, if data does not exist', () => {
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
		it('should select undefined, if data does not exist', () => {
			expect(commonSelectors.getAllAsObject(getSubstate)(NO_DATA_STATE, 1)).toBeNull();
		});
	});
});