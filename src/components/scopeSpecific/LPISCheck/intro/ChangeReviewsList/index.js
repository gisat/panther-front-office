import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	let cases = Select.lpisCheckCases.getFilteredCases(state, {searchString, filterVisited, filterConfirmed});
	const searchString = Select.lpisCheckCases.getFilterSearch(state);
	const filterVisited = Select.lpisCheckCases.getFilterVisited(state);
	const filterConfirmed = Select.lpisCheckCases.getFilterConfirmed(state);

	return {
		cases: cases,
		searchString,
		filterVisited,
		filterConfirmed,
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		changeSearch: (searchParams) => {
			dispatch(Action.lpisCheck.changeSearch(searchParams))
		},
		showCase: (caseKey) => {
			dispatch(Action.lpisCheck.setActive(caseKey));
			// dispatch(Action.components.setIntro(false));
			dispatch(Action.lpisCheck.redirectToActiveCaseView());
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
