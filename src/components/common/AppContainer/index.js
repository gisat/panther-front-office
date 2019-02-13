import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	return {
		activeUser: Select.users.getActive(state)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
