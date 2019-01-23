export const getSubstate = (state) => state.maps;

export const BASIC_STATE = {
	maps: {
		activeSetKey: null,
		activeMapKey: null,
		maps: {
			Map1: {
				key: 'Map1',
				data: {}
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
				data: {},
				sync: {}
			}
		}
	}
};

export const EMPTY_SETS_STATE = {...BASIC_STATE, maps: {...BASIC_STATE.maps, sets: {}}};

