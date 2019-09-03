import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';

import presentation from "./presentation";

const mapStateToProps = state => {
	return {
		templateKeys: Select.app.getConfiguration(state, 'templates')
	}
};

export default connect(mapStateToProps)(presentation);