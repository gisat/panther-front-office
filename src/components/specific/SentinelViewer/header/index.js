import { connect } from 'react-redux';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	return {
		activePlace: Select.places.getActive(state),
		activeMap: Select.maps.getActiveMap(state),
		case: Select.specific.lpisCheckCases.getActiveCase(state),
		mapsContainer: Select.components.getMapsContainer(state),
		mapsCount: Select.maps.getMapsCount(state),
		places: Select.places.getPlacesForActiveScope(state),
		selectedMapOrder: Select.maps.getActiveMapOrder(state),
		userGroup: 'gisatAdmins',
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setActivePlace: (value) => {dispatch(Action.places.setActive(value))},
		addMap: ()=>{
			window.Stores.notify('mapsContainer#addMap');
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);