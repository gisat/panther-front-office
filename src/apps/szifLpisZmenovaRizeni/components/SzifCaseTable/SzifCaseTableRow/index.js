import { connect } from 'react-redux';
import Action from "../../../state/Action";
import Select from "../../../state/Select";

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	const caseSubmit = Select.specific.lpisChangeCases.getCaseSubmit(state, ownProps.metadataKey);
	const caseChange = Select.specific.lpisChangeCases.getCaseChange(state, ownProps.metadataKey);
	const caseEnd = Select.specific.lpisChangeCases.getCaseEnd(state, ownProps.metadataKey);
	const caseChanges = Select.specific.lpisChangeCases.getCaseChanges(state, ownProps.metadataKey);
	const caseStatus = Select.specific.lpisChangeCases.getCaseStatus(state, ownProps.metadataKey);
	
	return {
		caseSubmit,
		caseChange,
		caseEnd,
		caseChanges,
		caseStatus,
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
