import commonSelectors from '../../../state/_common/selectors';

const state = {
	scopes: {
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
	},
	places: {
		activeKey: null
	},
	periods: {
		1: {
			key: 1,
			data: {
				name: "Listopad"
			}
		},
		activeKey: null
	}
};

const getScopesSubstate = state => state.scopes;
const getPlacesSubstate = state => state.places;
const getPeriodsSubstate = state => state.periods;

describe('Common selectors', () => {
	describe('#getActive', () => {
		let expectedOutput = {
			key: 1,
			data: {
				name: "World"
			}
		};

		it('should select data about active scope from state', () => {
			expect(commonSelectors.getActive(getScopesSubstate)(state)).toEqual(expectedOutput);
		});
		it('should select undefined, when models do not exist', () => {
			expect(commonSelectors.getActive(getPlacesSubstate)(state)).toBeUndefined();
		});
		it('should select undefined, when active key is null', () => {
			expect(commonSelectors.getActive(getPeriodsSubstate)(state)).toBeUndefined();
		});
	});

	describe('#getActiveKey', () => {
		it('should select active key', () => {
			expect(commonSelectors.getActiveKey(getScopesSubstate)(state)).toBe(1);
		});
		it('should return null, when active key is not set', () => {
			expect(commonSelectors.getActiveKey(getPlacesSubstate)(state)).toBeNull();
		});
	});

	describe('#getAll', () => {
		it('selected data shoud be in array, if exists', () => {
			expect(Array.isArray(commonSelectors.getAll(getScopesSubstate)(state))).toBeTruthy();
		});
		it('should select all data', () => {
			expect(commonSelectors.getAll(getScopesSubstate)(state)).toHaveLength(2);
		});
		it('it should select null, if data does not exist', () => {
			expect(commonSelectors.getAll(getPlacesSubstate)(state)).toBeNull();
		});
	});

	describe('#getAllAsObject', () => {
		let expectedOutput = {
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
			expect(commonSelectors.getAllAsObject(getScopesSubstate)(state)).toEqual(expectedOutput);
		});
		it('should select undefined, if data does not exist', () => {
			expect(commonSelectors.getAllAsObject(getPlacesSubstate)(state)).toBeUndefined();
		});
	});

	describe('#getByKey', () => {
		let expectedOutput = {
				key: 1,
				data: {
					name: "World"
				}
			};
		it('selected data should equal expected object', () => {
			expect(commonSelectors.getByKey(getScopesSubstate)(state, 1)).toEqual(expectedOutput);
		});
		it('should select undefined, if data does not exist', () => {
			expect(commonSelectors.getAllAsObject(getPlacesSubstate)(state, 1)).toBeUndefined();
		});
	});
});