import CommonAction from '../../../state/Action';
import esponFuoreIndicators from './EsponFuoreIndicators/actions';
import esponFuoreSelections from './EsponFuoreSelections/actions';

export default {
	...CommonAction,
	specific: {
		esponFuoreIndicators,
		esponFuoreSelections
	}
}