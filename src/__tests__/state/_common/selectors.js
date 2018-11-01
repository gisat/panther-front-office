import Select from '../../../state/Select';
import commonSelectors from '../../../state/_common/selectors';
import {Selector} from 'redux-testkit';

const state = {
	scopes: {
		activeKey: 1,
		byKey: {
			1: {
				key: 1,
				name: "World"
			},
			2: {
				key: 2,
				name: "Europe"
			}
		}
	},
	places: {
		activeKey: null
	}
};

const getScopesSubstate = state => state.scopes;
const getPlacesSubstate = state => state.places;

describe('Common selectors', () => {
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
		it('selected data shoud be null, if does not exist', () => {
			expect(commonSelectors.getAll(getPlacesSubstate)(state)).toBeNull();
		});
	});
});