import {connect} from 'react-redux';
import {Action, Select} from '@gisatcz/ptr-state';
import {utils} from '@gisatcz/ptr-utils'

import presentation from "./presentation";

const filter = {application: true};

const mapStateToProps = (state, ownProps) => {
	return {
		places: Select.places.getIndexed(state, filter, null, null, 1, 20),
		activePlace: Select.places.getActive(state)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'scudeoCities_PlaceSelect_' + utils.randomString(6);

	return dispatch => {
		return {
			onMount: () => {
				// TODO order
				dispatch(Action.places.useIndexed(filter, null, null, 1, 20, componentId));
			},
			onUnmount: () => {
				dispatch(Action.places.useIndexedClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);