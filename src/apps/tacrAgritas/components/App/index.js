import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";


const mapStateToProps = (state, ownProps) => {
	return {
		activeScope: Select.scopes.getActive(state),
		activePlace: Select.places.getActive(state),
		activePeriodKey: Select.periods.getActiveKey(state),
		data: Select.specific.tacrAgritasData.getFeaturesForActiveMetadata(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onMount: () => {
			dispatch(Action.places.setActiveKey(ownProps.placeKey));
			dispatch(Action.specific.tacrAgritas.changeAppView());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);