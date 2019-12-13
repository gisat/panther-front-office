import { connect } from 'react-redux';
import _ from 'lodash';
import Action from '../../state/Action';
import Select from '../../state/Select';

import presentation from "./presentation";
import utils from "../../../../utils/utils";

const getAttributeKeys = (popupData, fidColumnName) => {
	if (popupData && fidColumnName) {
		let keys = popupData.map(point => {
			let attributes = {...point.data};
			delete attributes[fidColumnName];
			delete attributes.centroid;

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

const getAttributesData = (popupData, fidColumnName) => {
	if (fidColumnName && popupData && popupData.length) {
		return popupData.map(point => {
			let attributes = {...point.data};
			let id = attributes[fidColumnName];
			delete attributes[fidColumnName];
			delete attributes.centroid;

			return {id, attributes};
		});
	} else {
		return null;
	}
};

const mapStateToProps = (state, ownProps) => {
	let attributeKeys = getAttributeKeys(ownProps.data, ownProps.fidColumnName) || [];
	let attributesData = getAttributesData(ownProps.data, ownProps.fidColumnName) || null;

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