import { connect } from 'react-redux';
import Select from '../../../../../state/Select';
import Action from "../../../../../state/Action";
import utils from "../../../../../utils/utils";
import presentation from './presentation';

const mapStateToProps = (state, ownProps) => {
	let cases = Select.specific.lpisCheckCases.getFilteredCases(state, {searchString, filterVisited, filterConfirmed}, ownProps.scopeKey) || [];
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

const mapDispatchToProps = (dispatch, ownProps) => {
	const componentId = 'ViewsList_' + utils.randomString(6);
	const order = [['key', 'ascending']];
	return {

		onMount: () => {
			dispatch(Action.specific.lpisCheckCases.useIndexed(null, {scope_key: ownProps.scopeKey}, order, 1, 1000, componentId));
		},
		onUnmount: () => {
			dispatch(Action.specific.lpisCheckCases.useIndexedClear(componentId));
		},

		changeSearch: (searchParams) => {
			dispatch(Action.specific.lpisCheckCases.changeSearch(searchParams))
		},
		showCase: (caseKey) => {
			dispatch(Action.specific.lpisCheckCases.setActive(caseKey));
			dispatch(Action.specific.lpisCheckCases.redirectToActiveCaseView());
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
