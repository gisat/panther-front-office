import { connect } from 'react-redux';
import Action from '../../../state/Action';
import Select from '../../../state/Select';
import ViewSelector from './ViewSelector';

const mapStateToProps = state => {
	return {
		activeScope: Select.scopes.getActiveScopeData(state)
	}
};

const mapDispatchToProps = dispatch => {
	return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewSelector);