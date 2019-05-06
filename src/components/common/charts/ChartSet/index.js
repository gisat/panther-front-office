import { connect } from 'react-redux';
import Select from '../../../../state/Select';
import Action from "../../../../state/Action";

import presentation from './presentation';

const mapStateToProps = (state, props) => {
	return {
		// Select.charts.get
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		// Action.charts.add
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);
