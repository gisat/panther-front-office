import { connect } from 'react-redux';
import Select from '../../../state/Select';
import Action from "../../../state/Action";

import ChangeReviewsList from "../../presentation/controls/changeReviews/ChangeReviewsList/ChangeReviewsList";

const mapStateToProps = (state, props) => {
	return {
		cases: Select.lpisCases.getSearchResults(state),
		searchString: Select.lpisCases.getSearchString(state)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		changeSearchString: (searchString) => {
			dispatch(Action.lpisCases.changeSearchString(searchString))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeReviewsList);
