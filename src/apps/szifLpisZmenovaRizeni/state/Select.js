import {Select as CommonSelect} from '@gisatcz/ptr-state';

import lpisChangeCases from './LpisChangeCases/selectors';

export default {
	...CommonSelect,
	specific: {
		lpisChangeCases
	}
}