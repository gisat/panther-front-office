import { connect } from 'react-redux';
import Action from '../../state/Action';
import Select from '../../state/Select';
import PresentationWindow from "../presentation/Window/Window";

const mapStateToProps = (state, ownProps) => {
	return state.components.windows[ownProps.window];
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onClose: () => {
			dispatch(Action.components.windows.handleWindowVisibility(ownProps.window, false));
		},
		onDragStop: (options) => {
			dispatch(Action.components.windows.changeWindowPosition(ownProps.window, options));
		},
		onExpand: () => {
			dispatch(Action.components.windows.expandWindow(ownProps.window));
		},
		onResize: (options) => {
			dispatch(Action.components.windows.changeWindowPosition(ownProps.window, options));
			dispatch(Action.components.windows.changeWindowSize(ownProps.window, options));
		},
		onShrink: () => {
			dispatch(Action.components.windows.shrinkWindow(ownProps.window));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(PresentationWindow);