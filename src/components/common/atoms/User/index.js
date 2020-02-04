import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from '../../../../state/Action';

import utils from "../../../../utils/utils";
import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	const user = Select.users.getById(state, ownProps.userKey);
	return {
		user,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const componentId = 'User' + utils.randomString(6);

	const filter = {
		"id": {
			"in": [
				ownProps.userKey
			]
		}
	}
	

	return {
		onMount: () => {
			dispatch(Action.users.useIndexedUsers(null, filter, null, 1, 1, componentId));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);