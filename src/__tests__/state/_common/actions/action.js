import ActionTypes from "../../../../constants/ActionTypes";
import commonActions from "../../../../state/_common/actions";

jest.mock('../../../../state/Action');

// TODO
// actionDelete
// receiveDeleted
// create
// deleteByKey
// apiDelete
// actionClearIndex
// helpers - isCorrespondingIndex
// reducer - clearIndex

describe('#action', () => {
	it('should return merged action type and payload', () => {
		const type = 'ADD';
		const payload = {
			data: ["lemon", "orange", "apple"],
			count: 3
		};
		const expectedOutput = {
			type: 'SCOPES.ADD',
			data: ["lemon", "orange", "apple"],
			count: 3
		};

		expect(commonActions.action(ActionTypes.SCOPES, type, payload)).toEqual(expectedOutput);
	});

	it('should return merged action type and payload', () => {
		const type = 'USE.KEYS.REGISTER';
		const payload = {
			keys: [1, 2]
		};
		const expectedOutput = {
			type: 'SCOPES.USE.KEYS.REGISTER',
			keys: [1, 2]
		};

		expect(commonActions.action(ActionTypes.SCOPES, type, payload)).toEqual(expectedOutput);
	});

	it('should throw error if action type is not in namespace', () => {
		const type = 'USE.UNKNOWN_ACTION';
		const payload = {
			keys: [1, 2]
		};

		expect(() => {commonActions.action(ActionTypes.SCOPES, type, payload)}).toThrow();
	});

	it('should throw error if action type is not string', () => {
		const type = null;
		const payload = {
			keys: [1, 2]
		};

		expect(() => {commonActions.action(ActionTypes.SCOPES, type, payload)}).toThrow();
	});
});