import Select from '../../../../state/Select';
import {Selector} from 'redux-testkit';

const state = {
	areas: {
		selections: {
			activeKeys: null,
			byKey: {
				'djfh-shdj-asds': {
					key: 'djfh-shdj-asds',
					data: {
						colour: "#ff0000",
						selection: {
							attributeFilter: [{
								attribute: 2,
								attributeSet: 3,
								attributeType: "numeric",
								intervals: [1, 2]
							}, {
								attribute: 5,
								attributeSet: 3,
								attributeType: "text",
								values: ["Red", "Blue", "Black"]
							}]
						}
					}
				},
				'abcd-efgh-cdsf': {
					key: 'abcd-efgh-cdsf',
					data: {
						colour: "#0000ff",
						selection: {
							attributeFilter: [{
								attribute: 2,
								attributeSet: 3,
								attributeType: "numeric",
								intervals: [3, 4]
							}, {
								attribute: 5,
								attributeSet: 3,
								attributeType: "text",
								values: ["Green"]
							}]
						}
					}
				}
			}
		}
	}
};

const initialState = {
	areas: {
		selections: {
			activeKeys: null,
			byKey: null
		}
	}
};

describe('Selections selectors', () => {
	it('should select attribute filter for given color', () => {
		let color = "#0000ff";
		let expectedFilter = [{
			attribute: 2,
			attributeSet: 3,
			attributeType: "numeric",
			intervals: [3, 4]
		}, {
			attribute: 5,
			attributeSet: 3,
			attributeType: "text",
			values: ["Green"]
		}];

		Selector(Select.areas.selections.getSelectionByColourAttributeFilter).expect(state, color).toReturn(expectedFilter);
	});

	it('should select null for initial state', () => {
		let expectedFilter = null;
		let color = "#0000ff";
		Selector(Select.areas.selections.getSelectionByColourAttributeFilter).expect(initialState, color).toReturn(expectedFilter);
	});

	it('should select null if no color is passed', () => {
		let expectedFilter = null;
		let color = null;
		Selector(Select.areas.selections.getSelectionByColourAttributeFilter).expect(state, color).toReturn(expectedFilter);
	});
});