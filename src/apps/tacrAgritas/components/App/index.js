import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../state/Action';
import Select from '../../../../state/Select';

import presentation from "./presentation";


const mapStateToProps = (state, ownProps) => {
	return {
		place: Select.places.getActive(state)
	}
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onMount: () => {
			dispatch(Action.places.setActiveKey(ownProps.placeKey))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(presentation);