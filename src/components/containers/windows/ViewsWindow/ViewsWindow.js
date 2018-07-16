import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import ViewsWindow from "../../../presentation/windows/ViewsWindow/ViewsWindow";

const mapStateToProps = (state, ownProps) => {
	return {
		scopeKey: Select.scopes.getActiveScopeKey(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {

	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewsWindow);