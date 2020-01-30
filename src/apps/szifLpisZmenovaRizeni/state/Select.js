import CommonSelect from '../../../state/Select';

import lpisChangeCases from './LpisChangeCases/selectors';
import lpisChangeCasesEdited from './LpisChangeCasesEdited/selectors';
import lpisChangeDates from './LpisChangeDates/selectors';
import lpisZmenovaRizeni from './LpisZmenovaRizeni/selectors';

export default {
	...CommonSelect,
	specific: {
		lpisChangeCases,
		lpisChangeCasesEdited,
		lpisChangeDates,
		lpisZmenovaRizeni,
	}
}