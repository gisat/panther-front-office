import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import ViewsList from "../../presentation/controls/ViewsList/ViewsList";

const mapStateToProps = (state, props) => {
	return {
		views: Select.views.getViewsForScope(state, props.selectedScope)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		redirect: (params) => {
			dispatch(Action.components.redirectToView(params))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewsList);
