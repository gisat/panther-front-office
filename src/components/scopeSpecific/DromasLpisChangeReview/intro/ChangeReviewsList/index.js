import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	return {
		cases: Select.lpisCases.getSearchResults(state),
		searchString: Select.lpisCases.getSearchString(state),
		activeEditedCaseKey: Select.lpisCases.getActiveEditedCaseKey(state),
		activeEditedCase: Select.lpisCases.getActiveEditedCase(state),
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		changeSearchString: (searchString) => {
			dispatch(Action.lpisCases.changeSearchString(searchString))
		},
		createNewActiveEditedCase: () => {
			dispatch(Action.lpisCases.createNewActiveEditedCase())
		},
		showCase: (caseKey) => {
			dispatch(Action.lpisCases.setActive(caseKey));
			// dispatch(Action.components.setIntro(false));
			dispatch(Action.lpisCases.redirectToActiveCaseView());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
