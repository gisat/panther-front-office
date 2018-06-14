import { connect } from 'react-redux';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import WindowsContainer from "../../presentation/windowsContainers/DockedWindowsContainer";

const mapStateToProps = (state, ownProps) => {
	return {
		scenariosWindowDocked: Select.components.windows.isWindowDocked(state, {key: 'scenarios'})
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(WindowsContainer);