import {removeDuplicities, replaceIdWithKey} from '../../utils/models';

const emptyModels = [];
const newModels = [{
	id: 1,
	name: "First"
}, {
	key: 2,
	name: "Second"
}, {
	_id: 3,
	name: "Second"
}, {
	_id: 4,
	id: 4,
	name: "Second"
}];
const oldModels = [{
	key: 1,
	name: "First"
}];

describe('Models utils#replaceIdWithKey', () => {
	it('should return empty array', () => {
		expect(replaceIdWithKey(emptyModels)).toHaveLength(0);
	});

	let adjustedModels = replaceIdWithKey(newModels);
	it('should replace id with key, where it is needed', () => {
		expect(adjustedModels).toHaveLength(4);
		expect(adjustedModels[0].hasOwnProperty("key")).toBeTruthy();
		expect(adjustedModels[0].hasOwnProperty("id")).toBeFalsy();
		expect(adjustedModels[1].hasOwnProperty("key")).toBeTruthy();
		expect(adjustedModels[2].hasOwnProperty("id")).toBeFalsy();
		expect(adjustedModels[2].hasOwnProperty("_id")).toBeFalsy();
		expect(adjustedModels[2].hasOwnProperty("key")).toBeTruthy();
		expect(adjustedModels[3].hasOwnProperty("id")).toBeFalsy();
		expect(adjustedModels[3].hasOwnProperty("_id")).toBeFalsy();
		expect(adjustedModels[3].hasOwnProperty("key")).toBeTruthy();
	});
});

describe('Models utils#removeDuplicities', () => {
	it('should return only new models', () => {
		let models = removeDuplicities(oldModels, newModels);
		let desiredModel = {
			key: 2,
			name: "Second"
		};
		expect(models).toHaveLength(3);
		expect(models[0]).toMatchObject(desiredModel);
	});
});