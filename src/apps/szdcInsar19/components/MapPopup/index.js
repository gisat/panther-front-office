import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";
import utils from "../../../../utils/utils";

const getAttributeKeys = (popupData) => {
	const data = getAttributesData(popupData);
	if (data) {
		return Object.keys(data);
	} else {
		return null;
	}
};

const getAttributesData = (popupData) => {
	const data = popupData.length && popupData[0].data;
	if (data) {
		const {centroid, ID, ...attributes} = data;
		return attributes;
	} else {
		return null;
	}
};

const mapStateToProps = (state, ownProps) => {
	let attributeKeys = getAttributeKeys(ownProps.data) || [];
	let attributesData = getAttributesData(ownProps.data) || null;

	// TODO pass fidColumnName
	return {
		attributesMetadata: Select.attributes.getByKeys(state, attributeKeys),
		attributesData,
		featureKey: ownProps.data && ownProps.data.length && ownProps.data[0].data.ID
	}
};

const mapDispatchToPropsFactory = () => {
	const componentId = 'SzdcInsar09MapPopup' + utils.randomString(6);

	return (dispatch, ownProps) => {
		let attributeKeys = getAttributeKeys(ownProps.data);

		return {
			onMount: () => {
				if (attributeKeys) {
					dispatch(Action.attributes.useKeys(attributeKeys, componentId));
				}
			},
			onUnmount: () => {
				dispatch(Action.attributes.useKeysClear(componentId));
			}
		}
	}
};

export default connect(mapStateToProps, mapDispatchToPropsFactory)(presentation);