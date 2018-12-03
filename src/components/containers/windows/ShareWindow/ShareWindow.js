import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import ShareWindow from "../../../presentation/windows/ShareWindow/ShareWindow";

const mapStateToProps = (state, ownProps) => {
	return {
        	scopeKey: Select.scopes.getActiveScopeKey(state),
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onClose: () => {
			dispatch(Action.components.setShareSaveState(null));
		}	
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareWindow);