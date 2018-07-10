import Select from '../../../../state/Select';
import {Selector} from 'redux-testkit';

let state = {
	components: {
		overlays: {
			scenarioMapEditing: {
				open: false,
				map: {
					layerOpacity: 99
				}
			}
		}
	}
};

describe('Overlays Selectors', () => {
	it('should select map data from overlay', () => {
		let expectedMapData = {
			layerOpacity: 99
		};
		Selector(Select.components.overlays.getScenarioMapEditingMapData).expect(state).toReturn(expectedMapData);
	});
});