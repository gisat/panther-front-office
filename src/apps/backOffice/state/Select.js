import CommonSelect from '../../../state/Select';
import apps from './Apps/selectors';
import backOffice from './_backOffice/selectors';

import indicators from '../../esponFuore/state/Indicators/selectors';

export default {
	...CommonSelect,
	specific: {
		apps,
		backOffice,
		indicators
	}
}