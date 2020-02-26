import {Action as CommonAction} from '@gisatcz/ptr-state';

import lpisChangeCases from './LpisChangeCases/actions';

export default {
	...CommonAction,
	specific: {
		lpisChangeCases
	}
}