import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
		case: Select.lpisCases.getActiveCase(state),
		userGroup: Select.users.getActiveUserDromasLpisChangeReviewGroup(state)
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {

	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);