export const getSubstate = (state) => state.attributeSets;

export const BASIC_STATE = {
	attributeSets: {
		activeKey: null,
		activeKeys: null,
		byKey: {
			1: {
				key: 1,
				data: {
					name: "Land cover",
					attributes: [1, 2, 3, 4],
					topic: 2
				}
			},
			2: {
				key: 2,
				data: {
					name: "Land use",
					attributes: [2, 4],
					topic: 4
				}
			},
			3: {
				key: 3,
				data: {
					name: "Population",
					attributes: [1, 7, 8],
					topic: 2
				}
			},
			4: {
				key: 4,
				data: {
					name: "Area",
					attributes: null,
					topic: 3
				}
			},
			5: {
				key: 5,
				data: {
					name: "Quality",
					attributes: [2, 3],
					topic: 3
				}
			}
		}
	}
};

export const EMPTY_MODELS_STATE = {...BASIC_STATE, attributeSets: {...BASIC_STATE.attributeSets, byKey: {}}};
export const NO_MODELS_STATE = {...BASIC_STATE, attributeSets: {...BASIC_STATE.attributeSets, byKey: null}};
