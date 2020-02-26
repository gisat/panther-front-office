import {Action as CommonAction} from '@gisatcz/ptr-state';
import esponFuoreIndicators from './EsponFuoreIndicators/actions';
import esponFuoreSelections from './EsponFuoreSelections/actions';

export default {
	...CommonAction,
	specific: {
		esponFuoreIndicators,
		esponFuoreSelections
	}
}