export const getSubstate = (state) => state.screens;

export const BASIC_STATE = {
	screens: {
		screens: {
			'screen1': {
				lineage: 'screen1',
				data: {
					width: null,
					minActiveWidth: null,
					desiredState: 'retracted',
				}
			},
			'screen2': {
				lineage: 'screen2',
				data: {
					width: null,
					minActiveWidth: null,
					desiredState: 'retracted',
				}
			},
			'screen3': {
				lineage: 'screen3',
				data: {
					width: null,
					minActiveWidth: null,
					desiredState: 'open',
				}
			},
			'screen4': {
				lineage: 'screen4',
				data: {
					width: null,
					minActiveWidth: null,
					desiredState: 'open',
				}
			},
			'screen11': {
				lineage: 'screen11',
				data: {
					width: null,
					minActiveWidth: null,
					desiredState: 'open',
				}
			}
		},
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