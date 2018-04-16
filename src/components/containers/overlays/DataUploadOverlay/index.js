import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import DataUploadOverlay from './DataUploadOverlay';

const mapStateToProps = state => {
	return {
		open: Select.components.isDataUploadOverlayOpen(state)
	}
};

const mapDispatchToProps = dispatch => {
	return {
		closeOverlay: () => {
			dispatch(Action.components.handleUploadDataOverlay(false));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(DataUploadOverlay);