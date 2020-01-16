import { connect } from 'react-redux';
import Action from "../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	return {

	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		switchScreen: () => {
			dispatch(Action.specific.lpisChangeCases.setActiveKey(ownProps.metadataKey));
			dispatch(Action.components.set('szifScreenAnimator', 'activeScreenKey', 'szifMapView'));
		},
		showMap: () => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.applyView(ownProps.data.viewKey));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
