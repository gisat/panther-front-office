import { connect } from 'react-redux';

import Action from '../../../state/Action';
import Select from '../../../state/Select';
import ScopePlaceThemeSelectionSwitch from "../../presentation/temporary/ScopePlaceThemeSelectionSwitch";

const mapStateToProps = (state) => {
	return {
		active: Select.components.isAppInIntroMode(state) && Select.users.isAdmin(state),
		open: Select.components.overlays.isOverlayOpen(state, {key: 'views'})
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		closeOverlay: ()=>{
			dispatch(Action.components.overlays.closeOverlay('views'));
		},
		openOverlay: ()=>{
			dispatch(Action.components.overlays.openOverlay('views'));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ScopePlaceThemeSelectionSwitch);