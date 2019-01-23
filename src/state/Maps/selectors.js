import {createSelector} from 'reselect';
import _ from 'lodash';

const getMapsAsObject = state => state.maps.maps;
const getMapSetsAsObject = state => state.maps.sets;

const getMapByKey = createSelector(
	[getMapsAsObject,
	(state, key) => key],
	(maps, key) => {
		if (maps && !_.isEmpty(maps) && key) {
			return maps[key] ? maps[key] : null;
		} else {
			return null;
		}
	}
);

const getMapSetByKey = createSelector(
	[getMapSetsAsObject,
	(state, key) => key],
	(sets, key) => {
		if (sets && !_.isEmpty(sets) && key) {
			return sets[key] ? sets[key] : null;
		} else {
			return null;
		}
	}
);

const getMapSetMapKeys = createSelector(
	[getMapSetByKey],
	(set) => {
		if (set && set.maps && set.maps.length) {
			return set.maps;
		} else {
			return null;
		}
	}
);

const getMapNavigator = createSelector(
	[getMapByKey,
	getMapSetsAsObject,
	(state, mapKey, setKey) => setKey],
	(map, sets, setKey) => {
		if (map) {
			if (sets && setKey && sets[setKey]) {
				let mapSet = sets[setKey];
				if (mapSet.maps && _.includes(mapSet.maps, map.key)) {
					let mapNavigator = map.data && map.data.worldWindNavigator;
					let mapSetNavigator = mapSet.data && mapSet.data.worldWindNavigator;
					let navigator = {...mapSetNavigator, ...mapNavigator};
					return !_.isEmpty(navigator) ? navigator : null;
				} else {
					console.warn(`"state/Maps/selectors#getMapInSet: Map set ${map.setKey} does not contain map ${map.key}"`);
					return null;
				}
			} else {
				let navigator = map.data && map.data.worldWindNavigator;
				return navigator && !_.isEmpty(navigator) ? navigator : null;
			}
		} else {
			return null;
		}
	}
);

export default {
	getMapByKey,
	getMapNavigator,
	getMapSetByKey,
	getMapSetMapKeys,

	getMapsAsObject,
	getMapSetsAsObject
};