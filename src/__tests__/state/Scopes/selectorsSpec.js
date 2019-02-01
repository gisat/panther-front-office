import Select from '../../../state/Select';
import {Selector} from 'redux-testkit';
import _ from 'lodash';

let state = {
	scopes: {
		activeKey: 3971,
		byKey: {
			3971: {
				key: 3971,
				data: {
					configuration: {
						"pucsLandUseScenarios": {
							"templates": {
								"sourceVector": 3332,
								"sourceRaster": 4090,
								"uhi": 4091,
								"hwd": 4092
							}
						}
					}
				},
				permissions: {
					group: [{permission: "GET", id: 2}],
					user: [{permission: "GET", id: 3}, {permission: "GET", id: 4}]
				}
			},
			3972: {
				key: 3972,
				permissions: {
					group: [{permission: "GET", id: 4}],
				}
			},
			3973: {
				key: 3973,
				permissions: {
					group: [],
					user: [{permission: "GET", id: 2}, {permission: "POST", id: 4}]
				}
			}}
	},
};

describe('Scope basic Selectors', () => {
	it('should select active scope configuration', () => {
		let expectedConfiguration = {"pucsLandUseScenarios":{"templates":{"sourceVector":3332,"sourceRaster":4090,"uhi":4091,"hwd":4092}}};
		Selector(Select.scopes.getActiveScopeConfiguration).expect(state).toReturn(expectedConfiguration);
	});
});