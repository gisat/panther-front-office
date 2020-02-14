import { connect } from 'react-redux';
import path from "path";
import Action from "../../../state/Action";
import Select from "../../../state/Select";
import config from "../../../../../config/index";

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	const caseSubmit = Select.specific.lpisChangeCases.getCaseSubmit(state, ownProps.metadataKey);
	const caseChange = Select.specific.lpisChangeCases.getCaseChange(state, ownProps.metadataKey);
	const caseEnd = Select.specific.lpisChangeCases.getCaseEnd(state, ownProps.metadataKey);
	const caseChanges = Select.specific.lpisChangeCases.getCaseChanges(state, ownProps.metadataKey);
	const userGroups = Select.specific.lpisZmenovaRizeni.getActiveUserGroups(state);
	const caseStatus = Select.specific.lpisChangeCases.getCaseStatus(state, ownProps.metadataKey, userGroups);
	const caseData = Select.specific.lpisChangeCases.getDataByKey(state, ownProps.metadataKey);
	const caseCur = Select.specific.lpisChangeCases.getByKey(state, ownProps.metadataKey);
	const caseJiCode = caseData ? caseData.codeJi : null;
	const caseSubmitDate = caseData ? caseData.submitDate : null;
	const caseAttachments = caseCur ? caseCur.attachments : null;
	const attachmentsBaseUrl = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendPath, 'backend','rest','attachments');
	return {
		userGroups,
		case: caseData,
		caseSubmit: caseSubmit,
		caseSubmitDate,
		caseJiCode,
		caseChange,
		caseEnd,
		caseChanges,
		caseStatus,
		caseAttachments,
		attachmentsBaseUrl,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		switchScreen: () => {
			// dispatch(Action.specific.lpisChangeCases.setActiveKey(ownProps.metadataKey));
			dispatch(Action.components.set('szifScreenAnimator', 'activeScreenKey', 'szifMapView'));
		},
		showMap: () => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.applyView(ownProps.data.viewKey)).then(() => {
				dispatch(Action.specific.lpisChangeCases.setActiveKey(ownProps.metadataKey));
			});
		},
		invalidateCase: (caseKey) => {
			dispatch(Action.specific.szifLpisZmenovaRizeni.invalidateEvaluation(caseKey));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
