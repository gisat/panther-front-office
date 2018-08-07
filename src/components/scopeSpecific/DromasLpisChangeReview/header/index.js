import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
		activeMap: Select.maps.getActiveMap(state),
		case: Select.lpisCases.getActiveCase(state),
		userGroup: Select.users.getActiveUserDromasLpisChangeReviewGroup(state)
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {

		// todo old code actions
		addMap: ()=>{
			window.Stores.notify('mapsContainer#addMap');
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);