import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';

import presentation from "./presentation";
import exportData from './helpers';

const mapStateToProps = (state, ownProps) => {
	return {
		activeSelection: Select.specific.esponFuoreSelections.getActive(state)
	}
};

const mapDispatchToProps = () => (dispatch, ownProps) => {
	return {
		onExport: (type, applyFilter) => {
			return dispatch(exportData(type, applyFilter));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);