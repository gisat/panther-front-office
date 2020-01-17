import { connect } from 'react-redux';
import Select from '../../state/Select';
import Action from "../../state/Action";
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
		activeMap: Select.maps.getActiveMapKey(state),
		// mapsContainer: Select.components.getMapsContainer(state),
		mapsContainer: {columns: 3, rows: 2},
		// mapsCount: Select.maps.getMapsCount(state),
		mapsCount: 4,
		case: Select.specific.lpisChangeCases.getActive(state),
		// selectedMapOrder: Select.maps.getActiveMapOrder(state),
		selectedMapOrder: 1,
		// userApprovedEvaluation: Select.specific.lpisChangeReviewCases.getUserApprovedEvaluationOfActiveCase(state),
		// userCreatedCase: Select.specific.lpisChangeReviewCases.getUserCreatedActiveCase(state),
		// userGroup: Select.users.getActiveUserDromasLpisChangeReviewGroup(state),
		userGroup: 'gisatAdmins',
		// activeCaseEdited: Select.specific.lpisChangeReviewCases.getActiveCaseEdited(state),
		// nextCaseKey: Select.specific.lpisChangeReviewCases.getNextActiveCaseKey(state)
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		editActiveCase: (property, value) => {dispatch(Action.specific.lpisChangeReviewCases.editActiveCase(property, value))},
		// todo old code actions
		addMap: ()=>{
			window.Stores.notify('mapsContainer#addMap');
		},
		toggleGeometries: (mapKey, showBefore, showAfter) => {
			dispatch(Action.maps.update({
				key: mapKey,
				placeGeometryChangeReview: {
					showGeometryBefore: showBefore,
					showGeometryAfter: showAfter
				}
			}));
		},
		saveEvaluation: () => {
			dispatch(Action.specific.lpisChangeReviewCases.userActionSaveEvaluation());
		},
		saveAndApproveEvaluation: () => {
			dispatch(Action.specific.lpisChangeReviewCases.userActionSaveAndApproveEvaluation())
		},
		approveEvaluation: () => {
			dispatch(Action.specific.lpisChangeReviewCases.userActionApproveEvaluation())
		},
		rejectEvaluation: () => {
			dispatch(Action.specific.lpisChangeReviewCases.userActionRejectEvaluation())
		},
		closeEvaluation: () => {
			dispatch(Action.specific.lpisChangeReviewCases.userActionCloseEvaluation())
		},
		backToList: () => {
			// dispatch(Action.components.overlays.views.selectActiveScope());
			// dispatch(Action.components.overlays.openOverlay('views'));
			// dispatch(Action.components.setIntro(true));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);