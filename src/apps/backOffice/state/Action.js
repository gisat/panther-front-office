import CommonAction from '../../../state/Action';
import backOffice from './_backOffice/actions';
import apps from './Apps/actions';

import esponFuoreIndicators from '../../esponFuore/state/EsponFuoreIndicators/actions';

export default {
	...CommonAction,
	specific: {
		apps,
		backOffice,
		esponFuoreIndicators
	}
}