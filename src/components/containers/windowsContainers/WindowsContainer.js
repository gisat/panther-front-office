import { connect } from 'react-redux';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import WindowsContainer from "../../presentation/windowsContainers/WindowsContainer";

const mapStateToProps = (state, ownProps) => {
	return {
		scenariosWindowDocked: Select.components.windows.isWindowDocked(state, {key: 'scenarios'}),
		snapshotsWindowDocked: Select.components.windows.isWindowDocked(state, {key: 'snapshots'}),
		viewsWindowDocked: Select.components.windows.isWindowDocked(state, {key: 'views'})
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(WindowsContainer);