import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
		activeMap: Select.maps.getActiveMap(state),
		mapsContainer: Select.components.getMapsContainer(state),
		mapsCount: Select.maps.getMapsCount(state),
		case: Select.lpisCases.getActiveCase(state),
		selectedMapOrder: Select.maps.getActiveMapOrder(state),
		userGroup: Select.users.getActiveUserDromasLpisChangeReviewGroup(state),
		activeCaseEdited: Select.lpisCases.getActiveCaseEdited(state)
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		editActiveCase: (property, value) => {dispatch(Action.lpisCases.editActiveCase(property, value))},
		// todo old code actions
		addMap: ()=>{
			window.Stores.notify('mapsContainer#addMap');
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);