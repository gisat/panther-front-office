import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import ViewCard from "../../presentation/controls/ViewCard/ViewCard";

const mapStateToProps = (state, props) => {
	return {
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		deleteView: () => {
			dispatch(Action.dataviews.apiDeleteView(ownProps.viewKey))
		},
		redirect: () => {
			let params = {...ownProps.data, key: ownProps.viewKey, public: ownProps.public};
			dispatch(Action.components.redirectToView(params))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewCard);
