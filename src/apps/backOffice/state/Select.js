import CommonSelect from '../../../state/Select';
import apps from './Apps/selectors';
import backOffice from './_backOffice/selectors';

export default {
	...CommonSelect,
	specific: {
		apps,
		backOffice
	}
}