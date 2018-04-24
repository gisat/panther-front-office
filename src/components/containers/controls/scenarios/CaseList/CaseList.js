import { connect } from 'react-redux';
import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';
import CaseList from "../../../../presentation/controls/scenarios/CaseList/CaseList";

const mapStateToProps = (state, ownProps) => {
	return {
		cases: Select.scenarios.getCases(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {

	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CaseList);