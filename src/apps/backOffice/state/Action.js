import {Action as CommonAction} from '@gisatcz/ptr-state';
import backOffice from './_backOffice/actions';
import apps from './Apps/actions';
import configurations from './Configurations/actions';

import esponFuoreIndicators from '../../esponFuore/state/EsponFuoreIndicators/actions';

export default {
	...CommonAction,
	specific: {
		apps,
		configurations,
		backOffice,
		esponFuoreIndicators
	}
}