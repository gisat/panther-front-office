import {createSelector} from 'reselect';
import _ from 'lodash';
import CommonSelect from "../../../state/Select";

import tacrAgritasData from "./Data/selectors";

// helpers
const getPeriodsForScopeCombiner = (periods, activePlaceKey, activeScopeKey, resources) => {
	if (periods && activePlaceKey && activeScopeKey && resources) {
		const periodsForScope = resources[activePlaceKey] && resources[activePlaceKey][activeScopeKey] && Object.keys(resources[activePlaceKey][activeScopeKey]);
		return _.filter(periods, (period) => {
			return _.includes(periodsForScope, period.key);
		});

	} else {
		return null;
	}
};

const getPeriodsForActiveScope = createSelector(
	[
		CommonSelect.periods.getAll,
		CommonSelect.places.getActiveKey,
		CommonSelect.scopes.getActiveKey,
		(state) => CommonSelect.app.getConfiguration(state, 'resources')
	],
	getPeriodsForScopeCombiner
);

const getPeriodsForScope = createSelector(
	[
		CommonSelect.periods.getAll,
		CommonSelect.places.getActiveKey,
		(state, key) => key,
		(state) => CommonSelect.app.getConfiguration(state, 'resources')
	],
	getPeriodsForScopeCombiner
);

const getScopesForActivePlace = createSelector(
	[
		CommonSelect.scopes.getAll,
		CommonSelect.places.getActiveKey,
		(state) => CommonSelect.app.getConfiguration(state, 'resources')
	],
	(scopes, activePlaceKey, resources) => {
		if (scopes && activePlaceKey && resources) {
			const scopesForPlace = resources[activePlaceKey]  && Object.keys(resources[activePlaceKey]);
			return _.filter(scopes, (scope) => {
				return _.includes(scopesForPlace, scope.key);
			});
		} else {
			return null;
		}
	}
);

export default {
	...CommonSelect,
	specific: {
		tacrAgritas: {
			getPeriodsForScope,
			getPeriodsForActiveScope,
			getScopesForActivePlace
		},
		tacrAgritasData
	}
}