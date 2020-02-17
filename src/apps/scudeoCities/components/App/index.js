import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../../../state/Action';
import Select from '../../../../state/Select';
import {utils} from "panther-utils"

import presentation from "./presentation";

const mapStateToProps = (state, ownProps) => {
	const placeKey = ownProps.match.params.placeKey;
	
	if (placeKey) {
		return {
			activePlace: Select.places.getByKey(state, placeKey)
		}
	} else {
		return {};
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'scudeoCities_App_' + utils.randomString(6);
	
	return (dispatch, ownProps) => {
		const placeKey = ownProps.match.params.placeKey;
		
		if (placeKey) {
			return {
				onMount: () => {
					dispatch(Action.places.useKeys([placeKey], componentId));
				},
				onUnmount: () => {
					dispatch(Action.places.useKeysClear(componentId));
				}
			}
		} else {
			return {};
		}
	};
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);