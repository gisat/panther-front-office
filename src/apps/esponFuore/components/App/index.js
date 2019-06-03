import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";

const mapStateToProps = state => {
	return {
		activeScopeKey: Select.scopes.getActiveKey(state),
		activeScope: Select.scopes.getActive(state),
		activeAttributeKey: Select.attributes.getActiveKey(state),
		attribute: Select.attributes.getActive(state)
	}
};

export default connect(mapStateToProps)(presentation);