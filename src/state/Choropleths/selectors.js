import {createSelector} from 'reselect';
import _ from 'lodash';

import MapsSelector from '../Maps/selectors';
import PeriodsSelector from '../Periods/selectors';

const getAllByKey = state => state.choropleths.byKey;
const getActiveKeys = state => state.choropleths.activeKeys;

const getByKey = createSelector(
	[getAllByKey, (state, key) => key],
	(choropleths, key) => {
		return choropleths && choropleths[key] ? choropleths[key] : null;
	}
);

const getActiveChoropleths = createSelector(
	[getActiveKeys,getAllByKey],
	(keys, choropleths) => {
		if (keys && keys.length && choropleths){
			let activeChoropleths = [];
			keys.forEach((key) => {
				if (choropleths[key]){
					activeChoropleths.push(choropleths[key]);
				}
			});
			return activeChoropleths && activeChoropleths.length ? activeChoropleths : null;
		} else {
			return null;
		}
	}
);

// specialized
const getActiveChoroplethsForMaps = createSelector(
	[getActiveChoropleths, MapsSelector.getMaps, PeriodsSelector.getPeriods],
	(activeChoropleths, maps, periods) => {
		if (maps && activeChoropleths && periods){
			let choropleths = {};
			maps.forEach(map => {
				if (map.period){
					activeChoropleths.forEach(activeChoropleth => {
						if (activeChoropleth.byPeriod && activeChoropleth.byPeriod[map.period]){
							let data = activeChoropleth.byPeriod[map.period];
							let key = `${map.key}_${activeChoropleth.key}`;
							let period = map.period ? _.find(periods, period => {return period.key === map.period}) : null;

							choropleths[key] = {
								mapPeriod: period ? period.name : null,
								mapKey: map.key,
								choroplethKey: activeChoropleth.key,
								data: data
							}
						}
					});
				}
			});
			return choropleths;
		} else {
			return null;
		}
	}
);

export default {
	getActiveKeys,
	getByKey,

	getActiveChoroplethsForMaps
};