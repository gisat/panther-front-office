import Select from "../../../../state/Select";
import commonSelectors from "../../../../state/_common/selectors";
import {getSubstate, BASIC_STATE, NO_MODELS_STATE, EMPTY_MODELS_STATE, NO_INDEXES_STATE, EMPTY_INDEXES_STATE} from "../../../../__testUtils/sampleStates/_common";

describe('#getAllForActiveScope', () => {
	const order = null;

	let basicStateExpectedOutput = [{
		data: {
			name: "World"
		},
		key: 1,
		permissions: {
			activeUser: {get: true, update: true, delete: true},
			guest: {get: true, update: false, delete: false}
		}
	}, null, {
		data: {
			name: "Italy"
		},
		key: 3,
		permissions: {
			activeUser: {get: true, update: true, delete: true},
			guest: {get: false, update: false, delete: false}
		}
	}, {
		key: 11
	}];

	it('selected data should equal expected object', () => {
		expect(commonSelectors.getAllForActiveScope(getSubstate)(BASIC_STATE, order)).toEqual(basicStateExpectedOutput);
	});

	it('it should select null, if byKey does not exist', () => {
		expect(commonSelectors.getAllForActiveScope(getSubstate)(NO_MODELS_STATE)).toBeNull();
	});

	it('it should select null, if byKey is empty object', () => {
		expect(commonSelectors.getAllForActiveScope(getSubstate)(EMPTY_MODELS_STATE)).toBeNull();
	});

	it('it should select null, if indexes does not exist', () => {
		expect(commonSelectors.getAllForActiveScope(getSubstate)(NO_INDEXES_STATE)).toBeNull();
	});

	it('it should select null, if given index does not exist', () => {
		expect(commonSelectors.getAllForActiveScope(getSubstate)(EMPTY_INDEXES_STATE)).toBeNull();
	});
});