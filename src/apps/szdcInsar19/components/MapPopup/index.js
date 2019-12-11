import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";
import utils from "../../../../utils/utils";

const getAttributeKeys = (popupData) => {
	if (popupData) {
		let keys = popupData.map(point => {
			const {centroid, ID, ...attributes} = point.data;
			let keys = [];
			_.forIn(attributes, (value, key) => keys.push(key));
			return keys;

		});

		if (keys && keys.length) {
			return _.uniq(_.flatten(keys));
		} else {
			return null;
		}
	} else {
		return null;
	}
};

const getAttributesData = (popupData) => {
	// TODO pass columnId
	if (popupData && popupData.length) {
		return popupData.map(point => {
			const {centroid, ID, ...attributes} = point.data;
			return {id: ID, attributes};
		});
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
		featureKeys: ownProps.featureKeys
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