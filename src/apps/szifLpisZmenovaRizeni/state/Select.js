import CommonSelect from '../../../state/Select';

import lpisChangeCases from './LpisChangeCases/selectors';
import lpisChangeCasesEdited from './LpisChangeCasesEdited/selectors';
import lpisChangeDates from './LpisChangeDates/selectors';

export default {
	...CommonSelect,
	specific: {
		lpisChangeCases,
		lpisChangeCasesEdited,
		lpisChangeDates,
	}
}