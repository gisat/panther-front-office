import { connect } from 'react-redux';
import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import Overlay from './Overlay';

const mapStateToProps = state => {
	return {
		scope: Select.scopes.getActiveScopeData(state),
		activeAoi: Select.aoi.getActiveAoiKey(state)
	}
};

const mapDispatchToProps = dispatch => {
	return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Overlay);