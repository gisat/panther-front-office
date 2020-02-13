import CommonAction from '../../../state/Action';

import lpisChangeCases from './LpisChangeCases/actions';

export default {
	...CommonAction,
	specific: {
		lpisChangeCases
	}
}