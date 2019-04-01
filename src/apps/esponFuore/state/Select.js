import CommonSelect from '../../../state/Select';
import indicators from './Indicators/selectors';

export default {
	...CommonSelect,
	specific: {
		indicators
	}
}