import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';

import presentation from "./presentation";

const mapStateToProps = state => {
	return {
		activeScopeKey: Select.scopes.getActiveKey(state)
	}
};

export default connect(mapStateToProps)(presentation);