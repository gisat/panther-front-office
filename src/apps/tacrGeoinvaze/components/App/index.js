import {connect} from '@gisatcz/ptr-state';
import {Action, Select} from '@gisatcz/ptr-state';

import presentation from "./presentation";

const mapStateToProps = state => {
	return {
		categories: Select.app.getConfiguration(state, 'categories'),
		crayfishConfig: Select.app.getConfiguration(state, 'crayfish'),
		activeCase: Select.cases.getActive(state)
	}
};

export default connect(mapStateToProps)(presentation);