import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	let cases = Select.specific.lpisCheckCases.getFilteredCases(state, {searchString, filterVisited, filterConfirmed});
	const searchString = Select.specific.lpisCheckCases.getFilterSearch(state);
	const filterVisited = Select.specific.lpisCheckCases.getFilterVisited(state);
	const filterConfirmed = Select.specific.lpisCheckCases.getFilterConfirmed(state);

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
			dispatch(Action.specific.lpisCheck.changeSearch(searchParams))
		},
		showCase: (caseKey) => {
			dispatch(Action.specific.lpisCheck.setActive(caseKey));
			// dispatch(Action.components.setIntro(false));
			dispatch(Action.specific.lpisCheck.redirectToActiveCaseView());
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
