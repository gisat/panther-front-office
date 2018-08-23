import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
		activeMap: Select.maps.getActiveMap(state),
		mapsContainer: Select.components.getMapsContainer(state),
		mapsCount: Select.maps.getMapsCount(state),
		case: Select.lpisCases.getActiveCase(state),
		selectedMapOrder: Select.maps.getActiveMapOrder(state),
		userGroup: Select.users.getActiveUserDromasLpisChangeReviewGroup(state),
		activeCaseEdited: Select.lpisCases.getActiveCaseEdited(state),
		nextCaseKey: Select.lpisCases.getNextActiveCaseKey(state)
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		editActiveCase: (property, value) => {dispatch(Action.lpisCases.editActiveCase(property, value))},
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
			dispatch(Action.lpisCases.userActionSaveEvaluation());
		},
		saveAndApproveEvaluation: () => {
			dispatch(Action.lpisCases.userActionSaveAndApproveEvaluation())
		},
		approveEvaluation: () => {
			dispatch(Action.lpisCases.userActionApproveEvaluation())
		},
		rejectEvaluation: () => {
			dispatch(Action.lpisCases.userActionRejectEvaluation())
		},
		closeEvaluation: () => {
			dispatch(Action.lpisCases.userActionCloseEvaluation())
		},
		backToList: () => {
			dispatch(Action.components.overlays.views.selectActiveScope());
			dispatch(Action.components.overlays.openOverlay('views'));
			dispatch(Action.components.setIntro(true));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);