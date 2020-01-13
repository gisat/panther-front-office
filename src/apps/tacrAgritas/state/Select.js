import {createSelector} from 'reselect';
import _ from 'lodash';
import CommonSelect from "../../../state/Select";

const getPeriodsForActiveScope = createSelector(
	[
		CommonSelect.periods.getAll,
		CommonSelect.scopes.getActive,
		(state) => CommonSelect.app.getConfiguration(state, 'scopeHasPeriods')
	],
	(periods, activeScope, scopeHasPeriods) => {
		if (periods && activeScope && scopeHasPeriods) {
			const periodsForScope = scopeHasPeriods[activeScope.key];
			return _.filter(periods, (period) => {
				return _.includes(periodsForScope, period.key);
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
			getPeriodsForActiveScope
		}
	}
}