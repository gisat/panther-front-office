import Select from '../../../state/Select';
import {Selector} from 'redux-testkit';

let navigatorDataState = {
	maps: {
		defaults: {
			navigator: {
				lookAtLocation: {
					longitude: 150,
					latitude: 30
				},
				range: 3333
			}
		}
	}
};

let defaultsNullState = {
	maps: {
		defaults: null
	}
};

describe('Maps Selectors', () => {
	it('should select navigator data from map defaults', () => {
		let expectedResult = {
			lookAtLocation: {
				longitude: 150,
				latitude: 30
			},
			range: 3333
		};
		Selector(Select.maps.getNavigator).expect(navigatorDataState).toReturn(expectedResult);
	});

	it('should return null when map defaults has not been initialized yet', () => {
		Selector(Select.maps.getNavigator).expect(defaultsNullState).toReturn(null);
	});
});