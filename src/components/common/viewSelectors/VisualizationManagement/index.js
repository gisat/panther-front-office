import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import utils from "../../../../utils/utils";

import presentation from "./presentation";


const mapStateToProps = (state) => {
	return {
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		onManage: () => {
			dispatch(Action.visualizations.handleExtManagement());
		},
		onSave: () => {
			dispatch(Action.visualizations.handleExtSave());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);