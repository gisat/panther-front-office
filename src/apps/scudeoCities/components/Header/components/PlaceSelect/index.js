import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';

import Action from '../../../../../../state/Action';
import Select from '../../../../../../state/Select';
import {utils} from '@gisatcz/ptr-utils'

import presentation from "./presentation";

const filter = {application: true};

const mapStateToProps = (state, ownProps) => {
	return {
		placeSelectOpen: Select.components.get(state, 'scudeoCities_PlaceSelect', 'placeSelectOpen'),
		activePlace: Select.places.getByKey(state, ownProps.match.params.placeKey),
		activePlaceKey: ownProps.match.params.placeKey
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'scudeoCities_PlaceSelect_' + utils.randomString(6);

	return (dispatch, ownProps) => {
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
			selectPlace: (key) => {
				// dispatch(Action.places.setActiveKey(key));
				ownProps.history.push('/'+ key);
				dispatch(Action.components.set('scudeoCities_PlaceSelect', 'placeSelectOpen', false));
			}
		}
	}
};

export default withRouter(connect(mapStateToProps, mapDispatchToPropsFactory)(presentation));