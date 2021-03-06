import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	
	return {
		case: Select.specific.lpisCheckCases.getActiveCase(state),
		nextCaseKey: Select.specific.lpisCheckCases.getNextCaseKey(state),
		previousCaseKey: Select.specific.lpisCheckCases.getPreviousCaseKey(state),
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		caseVisited: (caseKey, visited) => {dispatch(Action.specific.lpisCheckCases.setCaseVisited(caseKey, visited))},
		caseConfirmed: (caseKey, confirmed) => {dispatch(Action.specific.lpisCheckCases.setCaseConfirmed(caseKey, confirmed))},
		setActivePlace: (value) => {dispatch(Action.places.setActive(value))},
		addMap: ()=>{
			window.Stores.notify('mapsContainer#addMap');
		},
		showCase: (caseKey) => {
			dispatch(Action.specific.lpisCheckCases.setActive(caseKey));
			dispatch(Action.specific.lpisCheckCases.redirectToActiveCaseView());
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);