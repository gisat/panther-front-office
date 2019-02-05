import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	return {
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onFocusScreen: (screenLineage) => {
			dispatch(Action.screens.topHistory(ownProps.setKey, screenLineage))
		},
		onCloseScreen: (screenLineage) => {
			dispatch(Action.screens.close(ownProps.setKey, screenLineage))
		},
		onOpenScreen: (screenLineage) => {
			dispatch(Action.screens.open(ownProps.setKey, screenLineage))
		},
		onRetractScreen: (screenLineage) => {
			dispatch(Action.screens.retract(ownProps.setKey, screenLineage))
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
