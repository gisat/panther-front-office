import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	return {

	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		switchScreen: () => {
			dispatch(Action.components.set('szifScreenAnimator', 'activeScreenKey', 'szifCaseList'));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
