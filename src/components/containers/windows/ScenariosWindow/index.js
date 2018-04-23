import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import ScenariosWindow from './ScenariosWindow';

const mapStateToProps = state => {
	return Select.components.windows.getScenariosWindow(state);
};

const mapDispatchToProps = dispatch => {
	return {
		onClose: () => {
			dispatch(Action.components.windows.handleWindowVisibility('scenarios', false));
		},
		onDragStop: (options) => {
			dispatch(Action.components.windows.changeWindowPosition('scenarios', options));
		},
		onExpand: () => {
			dispatch(Action.components.windows.expandWindow('scenarios'));
		},
		onResize: (options) => {
			dispatch(Action.components.windows.changeWindowPosition('scenarios', options));
			dispatch(Action.components.windows.changeWindowSize('scenarios', options));
		},
		onShrink: (options) => {
			dispatch(Action.components.windows.shrinkWindow('scenarios', options));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ScenariosWindow);