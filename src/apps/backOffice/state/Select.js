import {Select as CommonSelect} from '@gisatcz/ptr-state';
import apps from './Apps/selectors';
import configurations from './Configurations/selectors';
import backOffice from './_backOffice/selectors';

import esponFuoreIndicators from '../../esponFuore/state/EsponFuoreIndicators/selectors';

export default {
	...CommonSelect,
	specific: {
		apps,
		configurations,
		backOffice,
		esponFuoreIndicators
	}
}