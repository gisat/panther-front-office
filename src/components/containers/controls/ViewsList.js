import { connect } from 'react-redux';

import Select from '../../../state/Select';
import ViewsList from "../../presentation/controls/ViewsList/ViewsList";

const mapStateToProps = (state, props) => {
	return {
		views: Select.views.getViewsForScope(state, props.selectedScope)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewsList);
