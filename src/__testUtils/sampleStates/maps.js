export const getSubstate = (state) => state.maps;

export const BASIC_STATE = {
	maps: {
		activeSetKey: null,
		activeMapKey: null,
		maps: {
			Map1: {
				key: 'Map1',
				data: {
					worldWindNavigator: {
						lookAtLocation: {
							longitude: 15,
							latitude: 50
						},
						range: 10000
					}
				}
			},
			Map2: {
				key: 'Map2',
				data: {}
			}
		},
		sets: {
			MapSet1: {
				key: 'MapSet1',
				maps: ['Map1, Map2'],
				data: {
					worldWindNavigator: {
						lookAtLocation: {
							longitude: 10,
							latitude: 60
						},
						range: 10000,
						tilt: 0,
						heading: 10,
						roll: 0
					}
				},
				sync: {}
			}
		}
	}
};

export const EMPTY_MAPS_STATE = {...BASIC_STATE, maps: {...BASIC_STATE.maps, maps: {}}};
export const EMPTY_SETS_STATE = {...BASIC_STATE, maps: {...BASIC_STATE.maps, sets: {}}};

