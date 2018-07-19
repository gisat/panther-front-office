import { connect } from 'react-redux';
import Select from '../../../state/Select';

import ChangeReviewsList from "../../presentation/controls/changeReviews/ChangeReviewsList/ChangeReviewsList";

const mapStateToProps = (state, props) => {
	return {
		cases: Select.lpisCases.getCasesWithChanges(state)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeReviewsList);
