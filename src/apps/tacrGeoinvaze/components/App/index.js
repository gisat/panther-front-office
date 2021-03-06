import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';

import presentation from "./presentation";

const mapStateToProps = state => {
	return {
		categories: Select.app.getConfiguration(state, 'categories'),
		crayfishConfig: Select.app.getConfiguration(state, 'crayfish'),
		activeCase: Select.cases.getActive(state)
	}
};

export default connect(mapStateToProps)(presentation);