import { connect } from 'react-redux';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import WindowsContainer from "../../presentation/windowsContainers/WindowsContainer";

const mapStateToProps = (state, ownProps) => {
	return {
		scenariosWindowDocked: Select.components.windows.isWindowDocked(state, {key: 'scenarios'}),
		viewsWindowDocked: Select.components.windows.isWindowDocked(state, {key: 'views'}),
		shareWindowDocked: Select.components.windows.isWindowDocked(state, {key: 'share'}),
		shareWindowVisible: Select.components.windows.isWindowOpen(state, {key: 'share'}),
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(WindowsContainer);