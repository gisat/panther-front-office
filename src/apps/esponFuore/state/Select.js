import CommonSelect from '../../../state/Select';
import esponFuoreIndicators from './EsponFuoreIndicators/selectors';
import esponFuoreSelections from './EsponFuoreSelections/selectors';

export default {
	...CommonSelect,
	specific: {
		esponFuoreIndicators,
		esponFuoreSelections
	}
}