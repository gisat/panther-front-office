import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import ViewsList from "../../presentation/controls/ViewsList/ViewsList";

const mapStateToProps = (state, props) => {
	return {
		views: Select.dataviews.getViewsForScope(state, props.selectedScope),
		isIntro: Select.components.isAppInIntroMode(state)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewsList);
