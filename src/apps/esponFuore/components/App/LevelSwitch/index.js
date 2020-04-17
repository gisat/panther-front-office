import { connect } from 'react-redux';

import Action from "../../../state/Action";
import Select from '../../../state/Select';

import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
		activeLevel: Select.app.getLocalConfiguration(state, "activeAuLevel"),
		activeIndicator: Select.specific.esponFuoreIndicators.getActive(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		switchLevel: (level) => {
			dispatch(Action.windows.remove(ownProps.windowSetKey, 'legend'));
			dispatch(Action.specific.esponFuore.changeAuLevel(level));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);