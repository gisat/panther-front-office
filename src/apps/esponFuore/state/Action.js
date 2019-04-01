import CommonAction from '../../../state/Action';
import indicators from './Indicators/actions';

export default {
	...CommonAction,
	specific: {
		indicators
	}
}