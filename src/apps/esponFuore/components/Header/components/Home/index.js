import { connect } from 'react-redux';

import Action from '../../../../state/Action';

import presentation from "./presentation";


const mapDispatchToProps = dispatch => {
	return {
		onClick: () => {
			dispatch(Action.scopes.setActiveKey(null));
		}
	}
};

export default connect(null, mapDispatchToProps)(presentation);