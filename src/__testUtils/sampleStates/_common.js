export const getSubstate = (state) => state.sample;

export const BASIC_STATE = {
	sample: {
		activeKey: 1,
		activeKeys: null,
		byKey: {
			1: {
				key: 1,
				data: {
					name: "World"
				},
				permissions: {
					activeUser: {get: true, update: true, delete: true},
					guest: {get: true, update: false, delete: false}
				}
			},
			2: {
				key: 2,
				data: {
					name: "Europe"
				},
				permissions: {
					activeUser: {get: true, update: true, delete: true},
					guest: {get: true, update: false, delete: false}
				}
			},
			3: {
				key: 3,
				data: {
					name: "Italy"
				},
				permissions: {
					activeUser: {get: true, update: true, delete: true},
					guest: {get: false, update: false, delete: false}
				}
			},
			4: {
				key: 4,
				data: {
					name: "Česko"
				},
				permissions: {
					activeUser: {get: true, update: true, delete: true},
					guest: {get: false, update: false, delete: false}
				}
			},
			5: {
				key: 5,
				data: {
					name: "Deutschland"
				},
				permissions: {
					activeUser: {get: true, update: true, delete: true},
					guest: {get: false, update: false, delete: false}
				}
			},
			6: {
				key: 6,
				data: {
					name: "Polska"
				},
				permissions: {
					activeUser: {get: true, update: true, delete: true},
					guest: {get: false, update: false, delete: false}
				}
			},
			7: {
				key: 7,
				data: {
					name: "Slovensko"
				},
				permissions: {
					activeUser: {get: true, update: true, delete: true},
					guest: {get: false, update: false, delete: false}
				}
			},
			8: {
				key: 8,
				data: {
					name: "Suomi"
				},
				permissions: {
					activeUser: {get: true, update: true, delete: true},
					guest: {get: false, update: false, delete: false}
				}
			},
			9: {
				key: 9,
				data: {
					name: "France"
				},
				permissions: {
					activeUser: {get: true, update: false, delete: true},
					guest: {get: false, update: false, delete: false}
				}
			},
			10: {
				key: 10,
				data: {
					name: "Espana"
				},
				permissions: {
					activeUser: {get: true, update: false, delete: false},
					guest: {get: false, update: true, delete: true}
				}
			},
			11: {
				key: 11,
			},
			12: {
				key: 12,
				data: {

				}
			}
		},
		editedByKey: {
			1: {
				key: 1,
				data: {
					name: "Svět",
					description: "..."
				}
			},
			4: {
				key: 4,
				data: {
					name: "Česko"
				}
			},
			5: {
				key: 5,
				data: {}
			},
			'nejake-nahodne-uuid': {
				key: 'nejake-nahodne-uuid',
				data: {
					name: "Gisat"
				}
			}
		},
		inUse: {
			indexes: {
				Component_a: [{
					filter: {scope: 666},
					filterByActive: null,
					order: null,
					start: 1,
					length: 5
				}, {
					filter: null,
					filterByActive: null,
					order: [['name', 'ascending']],
					start: 1,
					length: 5
				}],
				Component_b: [{
					filter: null,
					filterByActive: {scope: true},
					order: null,
					start: 6,
					length: 5
				}],
				Component_c: [{
					filter: null,
					filterByActive: null,
					order: [['name', 'ascending']],
					start: 1,
					length: 5
				}],
				Component_d: [{
					filter: null,
					filterByActive: null,
					order: [['name', 'ascending']],
					start: 3,
					length: 5
				}, {
					filter: null,
					filterByActive: null,
					order: [['name', 'ascending']],
					start: 7,
					length: 5
				}]
			},
			keys: {
				Component_w: [1, 2, 3],
				Component_x: [3, 4]
			}
		},
		indexes: [
			{
				changedOn: "2018-12-03T15:25:12.745Z",
				count: 4,
				filter: {scope: 666},
				order: null,
				index: {1: 1, 3: 3, 4: 11}
			}, {
				changedOn: "2018-12-03T15:25:12.745Z",
				count: 10,
				filter: null,
				order: [['name', 'ascending']],
				index: {1: 4, 2: 5, 3: 10, 4: 2, 5: 9, 6: 3, 7: 6, 8: 7, 9: 8, 10: 1}
			}
		],
	},
	scopes: {
		activeKey: 666
	},
	themes: {},
	places: {},
	periods: {}
};

export const ACTIVE_KEYS_STATE = {...BASIC_STATE, sample: {...BASIC_STATE.sample, activeKey: null, activeKeys: [1, 2]}};
export const NO_ACTIVE_KEY_STATE = {...BASIC_STATE, sample: {...BASIC_STATE.sample, activeKey: null, activeKeys: null}};

export const EMPTY_MODELS_STATE = {...BASIC_STATE, sample: {...BASIC_STATE.sample, byKey: {}}};
export const NO_MODELS_STATE = {...BASIC_STATE, sample: {...BASIC_STATE.sample, byKey: null}};

export const EMPTY_INDEXES_STATE = {...BASIC_STATE, sample: {...BASIC_STATE.sample, indexes: []}};
export const NO_INDEXES_STATE = {...BASIC_STATE, sample: {...BASIC_STATE.sample, indexes: null}};

export const EMPTY_IN_USE_INDEXES_STATE = {...BASIC_STATE, sample: {...BASIC_STATE.sample, inUse: {...BASIC_STATE.sample.inUse, indexes: {}}}};
export const NO_IN_USE_INDEXES_STATE = {...BASIC_STATE, sample: {...BASIC_STATE.sample, inUse: {...BASIC_STATE.sample.inUse, indexes: null}}};

export const EMPTY_IN_USE_KEYS_STATE = {...BASIC_STATE, sample: {...BASIC_STATE.sample, inUse: {...BASIC_STATE.sample.inUse, keys: {}}}};
export const NO_IN_USE_KEYS_STATE = {...BASIC_STATE, sample: {...BASIC_STATE.sample, inUse: {...BASIC_STATE.sample.inUse, keys: null}}};

export const EMPTY_EDITED_MODELS_STATE = {...BASIC_STATE, sample: {...BASIC_STATE.sample, editedByKey: {}}};
export const NO_EDITED_MODELS_STATE = {...BASIC_STATE, sample: {...BASIC_STATE.sample, editedByKey: null}};