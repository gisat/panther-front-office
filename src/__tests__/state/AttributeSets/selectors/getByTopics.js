import Select from "../../../../state/Select";
import {getSubstate, BASIC_STATE, EMPTY_MODELS_STATE, NO_MODELS_STATE} from "../../../../__testUtils/sampleStates/attributeSets";

describe('#getByTopics', () => {
	it('should select only attribute sets for given topics', () => {
		let topics = 2;
		expect(Select.attributeSets.getByTopics(BASIC_STATE, topics)).toHaveLength(2);
	});

	it('should select only attribute sets for given topics', () => {
		let topics = [2, 3];
		expect(Select.attributeSets.getByTopics(BASIC_STATE, topics)).toHaveLength(4);
	});

	it('should select null if no topics were given', () => {
		let topics = null;
		expect(Select.attributeSets.getByTopics(BASIC_STATE, topics)).toBeNull();
	});

	it('should select null, when byKey do not exist', () => {
		let topics = [2, 3];
		expect(Select.attributeSets.getByTopics(NO_MODELS_STATE, topics)).toBeNull();
	});

	it('should select null, when byKey is empty object', () => {
		let topics = [2, 3];
		expect(Select.attributeSets.getByTopics(EMPTY_MODELS_STATE, topics)).toBeNull();
	});
});