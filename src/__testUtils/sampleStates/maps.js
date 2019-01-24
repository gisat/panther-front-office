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
			},
			Map3: {
				key: 'Map3',
				data: {
					worldWindNavigator: {

					}
				}
			},
			Map4: {
				key: 'Map4',
				data: {
					worldWindNavigator: {
						lookAtLocation: {
							longitude: 15,
							latitude: 50
						},
						range: 10000
					}
				}
			}
		},
		sets: {
			MapSet1: {
				key: 'MapSet1',
				maps: ['Map1', 'Map2', 'Map3'],
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
				sync: {
					location: true,
					roll: false,
					range: false,
					tilt: false,
					heading: false,
					elevation: false,
				}
			}
		}
	}
};

export const EMPTY_MAPS_STATE = {...BASIC_STATE, maps: {...BASIC_STATE.maps, maps: {}}};
export const EMPTY_SETS_STATE = {...BASIC_STATE, maps: {...BASIC_STATE.maps, sets: {}}};

export const EMPTY_SET_DATA_STATE = {
	...BASIC_STATE,
	maps: {
		...BASIC_STATE.maps,
		sets: {
			...BASIC_STATE.maps.sets,
			MapSet1: {
				key: 'MapSet1',
				maps: ['Map1', 'Map2'],
				data: {}
			},
			sync: {
				location: true,
				roll: false,
				range: false,
				tilt: false,
				heading: false,
				elevation: false,
			}
		}
	}
};

export const EMPTY_SET_NAVIGATOR_STATE = {
	...EMPTY_SET_DATA_STATE,
	maps: {
		...EMPTY_SET_DATA_STATE.maps,
		sets: {
			...EMPTY_SET_DATA_STATE.maps.sets,
			MapSet1: {
				...EMPTY_SET_DATA_STATE.maps.sets.MapSet1,
				data: {
					worldWindNavigator: {}
				}
			}
		}
	}
};

export const MAP_SET_WITHOUT_SYNC = {
	...BASIC_STATE,
	maps: {
		...BASIC_STATE.maps,
		sets: {
			...BASIC_STATE.maps.sets,
			MapSet1: {
				key: 'MapSet1',
				maps: ['Map1', 'Map2'],
				data: {}
			}
		}
	}
};

export const MAP_SET_EMPTY_SYNC = {
	...BASIC_STATE,
	maps: {
		...BASIC_STATE.maps,
		sets: {
			...BASIC_STATE.maps.sets,
			MapSet1: {
				key: 'MapSet1',
				maps: ['Map1', 'Map2'],
				sync: {}
			}
		}
	}
};

