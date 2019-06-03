import _ from 'lodash';
import Select from "../../../../state/Select";
import {Selector} from 'redux-testkit';
import {getSubstate, BASIC_STATE, EMPTY_MAPS_STATE} from "../../../../__testUtils/sampleStates/maps";

describe('#getMapByKey', () => {
	it('should select map for given key, if exists in maps', () => {
		const setKey = 'Map2';
		const expectedOutput = {
			key: 'Map2',
			data: {
				metadataModifiers: {
					place: 'place12'
				},
				layers: [{
					layerTemplate: 'template4'
				}],
				backgroundLayer: 'background1',
			}
		};
		Selector(Select.maps.getMapByKey).expect(BASIC_STATE, setKey).toReturn(expectedOutput);
	});

	it('should select null, if set for given key does not exist', () => {
		const setKey = 'aaa';
		expect(Selector(Select.maps.getMapByKey).execute(BASIC_STATE, setKey)).toBeNull();
	});

	it('should select null for empty sets', () => {
		const setKey = 'aaa';
		expect(Selector(Select.maps.getMapByKey).execute(EMPTY_MAPS_STATE, setKey)).toBeNull();
	});

	it('should select null, if no key was passed', () => {
		expect(Selector(Select.maps.getMapByKey).execute(BASIC_STATE)).toBeNull();
	});
});