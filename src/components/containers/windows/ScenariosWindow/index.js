import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import ScenariosWindow from './ScenariosWindow';

const mapStateToProps = state => {
	return {
		open: Select.components.isScenariosWindowOpen(state)
	}
};

const mapDispatchToProps = dispatch => {
	return {
		onClose: () => {
			dispatch(Action.components.handleWindowVisibility('scenarios', false));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ScenariosWindow);