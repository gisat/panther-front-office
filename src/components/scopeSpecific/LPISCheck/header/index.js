import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	
	return {
		case: Select.lpisCheckCases.getActiveCase(state),
		nextCaseKey: Select.lpisCheckCases.getNextCaseKey(state),
		previousCaseKey: Select.lpisCheckCases.getPreviousCaseKey(state),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		caseVisited: (caseKey, visited) => {dispatch(Action.lpisCheck.setCaseVisited(caseKey, visited))},
		caseConfirmed: (caseKey, confirmed) => {dispatch(Action.lpisCheck.setCaseConfirmed(caseKey, confirmed))},
		setActivePlace: (value) => {dispatch(Action.places.setActive(value))},
		addMap: ()=>{
			window.Stores.notify('mapsContainer#addMap');
		},
		showCase: (caseKey) => {
			dispatch(Action.lpisCheck.setActive(caseKey));
			dispatch(Action.lpisCheck.redirectToActiveCaseView());
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);