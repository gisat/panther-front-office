import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
		case: Select.lpisCases.getActiveCase(state),
		userGroup: Select.users.getActiveUserDromasLpisChangeReviewGroup(state),
		activeCaseEdited: Select.lpisCases.getActiveCaseEdited(state)
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		editActiveCase: (property, value) => {dispatch(Action.lpisCases.editActiveCase(property, value))}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);