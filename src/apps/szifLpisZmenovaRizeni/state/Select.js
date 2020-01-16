import CommonSelect from '../../../state/Select';

import lpisChangeCases from './LpisChangeCases/selectors';
import lpisChangeCasesEdited from './LpisChangeCasesEdited/selectors';

export default {
	...CommonSelect,
	specific: {
		lpisChangeCases,
		lpisChangeCasesEdited,
	}
}