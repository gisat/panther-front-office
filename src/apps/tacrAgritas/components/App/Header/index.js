import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../../state/Action';
import Select from '../../../../../state/Select';

import presentation from "./presentation";


const mapStateToProps = (state, ownProps) => {
	return {
		case: Select.cases.getActive(state),
		place: Select.places.getActive(state),
		period: Select.periods.getActive(state),
		scope: Select.scopes.getActive(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {

	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);