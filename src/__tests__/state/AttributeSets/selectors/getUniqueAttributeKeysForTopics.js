import Select from "../../../../state/Select";
import {getSubstate, BASIC_STATE, EMPTY_MODELS_STATE, NO_MODELS_STATE} from "../../../../__testUtils/sampleStates/attributeSets";

describe('#getUniqueAttributeKeysForTopics', () => {
	it('should select unique attribute keys for given topics', () => {
		let topics = 2;
		expect(Select.attributeSets.getUniqueAttributeKeysForTopics(BASIC_STATE, topics)).toEqual([1,2,3,4,7,8]);
	});

	it('should select unique attribute keys for given topics', () => {
		let topics = [2, 3];
		expect(Select.attributeSets.getUniqueAttributeKeysForTopics(BASIC_STATE, topics)).toEqual([1,2,3,4,7,8]);
	});

	it('should select unique attribute keys for given topics', () => {
		let topics = 3;
		expect(Select.attributeSets.getUniqueAttributeKeysForTopics(BASIC_STATE, topics)).toEqual([2,3]);
	});

	it('should select unique attribute keys for given topics', () => {
		let topics = 5;
		expect(Select.attributeSets.getUniqueAttributeKeysForTopics(BASIC_STATE, topics)).toBeNull();
	});

	it('should select null if no topics were given', () => {
		let topics = null;
		expect(Select.attributeSets.getUniqueAttributeKeysForTopics(BASIC_STATE, topics)).toBeNull();
	});

	it('should select null, when byKey do not exist', () => {
		let topics = [2, 3];
		expect(Select.attributeSets.getUniqueAttributeKeysForTopics(NO_MODELS_STATE, topics)).toBeNull();
	});

	it('should select null, when byKey is empty object', () => {
		let topics = [2, 3];
		expect(Select.attributeSets.getUniqueAttributeKeysForTopics(EMPTY_MODELS_STATE, topics)).toBeNull();
	});
});