import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import DataUploadOverlay from './DataUploadOverlay';

const mapStateToProps = state => {
	return {
		open: Select.components.overlays.isOverlayOpen(state, {key: 'dataUpload'})
	}
};

const mapDispatchToProps = dispatch => {
	return {
		closeOverlay: () => {
			dispatch(Action.components.overlays.closeOverlay('dataUpload'));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(DataUploadOverlay);