import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import ScenariosWindow from './ScenariosWindow';

const mapStateToProps = state => {
	return Select.components.getScenariosWindow(state);
};

const mapDispatchToProps = dispatch => {
	return {
		onClose: () => {
			dispatch(Action.components.handleWindowVisibility('scenarios', false));
		},
		onDragStop: (options) => {
			dispatch(Action.components.changeWindowPosition('scenarios', options));
		},
		onExpand: () => {
			dispatch(Action.components.expandWindow('scenarios'));
		},
		onResize: (options) => {
			dispatch(Action.components.changeWindowPosition('scenarios', options));
			dispatch(Action.components.changeWindowSize('scenarios', options));
		},
		onShrink: (options) => {
			dispatch(Action.components.shrinkWindow('scenarios', options));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ScenariosWindow);