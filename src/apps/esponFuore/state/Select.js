import {Select as CommonSelect} from '@gisatcz/ptr-state';
import esponFuoreIndicators from './EsponFuoreIndicators/selectors';
import esponFuoreSelections from './EsponFuoreSelections/selectors';

export default {
	...CommonSelect,
	specific: {
		esponFuoreIndicators,
		esponFuoreSelections
	}
}