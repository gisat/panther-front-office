export const getSubstate = (state) => state.screens;

export const BASIC_STATE = {
	screens: {
		screens: {},
		sets: {
			'set1': {
				orderByHistory: ['screen2', 'screen1', 'screen4', 'screen3'],
				orderBySpace: ['screen1', 'screen2', 'screen3', 'screen4'],
			},
			'set2': {
				orderByHistory: ['sceen11'],
				orderBySpace: ['screen11'],
			},
			'set3': {
				orderByHistory: [],
				orderBySpace: [],
			}
		}
	}
};

export const INITIAL_STATE = {...BASIC_STATE, screens: {screens: {}, sets: {}}};