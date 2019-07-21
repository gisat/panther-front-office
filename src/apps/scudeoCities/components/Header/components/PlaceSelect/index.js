import { connect } from 'react-redux';
import _ from 'lodash';

import Action from '../../../../../../state/Action';
import Select from '../../../../../../state/Select';
import utils from '../../../../../../utils/utils';

import presentation from "./presentation";

const filter = {application: true};

const mapStateToProps = (state, ownProps) => {
	return {
		placeSelectOpen: Select.components.get(state, 'scudeoCities_PlaceSelect', 'placeSelectOpen'),
		activePlace: Select.places.getActive(state)
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'scudeoCities_PlaceSelect_' + utils.randomString(6);

	return dispatch => {
		return {
			openSelect: () => {
				dispatch(Action.components.set('scudeoCities_PlaceSelect', 'placeSelectOpen', true))
			},
			closeSelect: () => {
				dispatch(Action.components.set('scudeoCities_PlaceSelect', 'placeSelectOpen', false))
			},
			onMount: () => {

			},
			onUnmount: () => {

			},
			selectCase: (key) => {
				dispatch(Action.places.setActiveKey(key));
				dispatch(Action.components.set('scudeoCities_PlaceSelect', 'placeSelectOpen', false));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);