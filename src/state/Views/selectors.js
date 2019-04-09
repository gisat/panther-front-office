import {createSelector} from 'reselect';
import _ from 'lodash';

import common from "../_common/selectors";

import attributesSelectors from '../Attributes/selectors';
import attributeSetsSelectors from '../AttributeSets/selectors';
import componentsSelectors from '../Components/selectors';
import scopesSelectors from '../Scopes/selectors';

const getSubstate = state => state.views;

const getActiveKey = common.getActiveKey(getSubstate);
const getActiveKeys = common.getActiveKeys(getSubstate);

const getAll = common.getAll(getSubstate);
const getAllAsObject = common.getAllAsObject(getSubstate);

const getByKey = common.getByKey(getSubstate);
const getByKeys = common.getByKeys(getSubstate);

const getDataByKey = common.getDataByKey(getSubstate);
const getEditedDataByKey = common.getEditedDataByKey(getSubstate);

const getDeletePermissionByKey = common.getDeletePermissionByKey(getSubstate);
const getUpdatePermissionByKey = common.getUpdatePermissionByKey(getSubstate);

const getStateToSave = createSelector(
	[
		attributesSelectors.getStateToSave,
		attributeSetsSelectors.getStateToSave,
		componentsSelectors.getStateToSave,
		scopesSelectors.getStateToSave,
	],
	(attributes, attributeSets, components, scopes) => {
		return {
			attributes,
			attributeSets,
			components,
			scopes
		}
	}
);

export default {
	getActiveKey,
	getActiveKeys,
	getByKeys,
	getDataByKey,
	getEditedDataByKey,
	getViewsData: getByKey,

	getAll,
	getAllAsObject,

	getDeletePermissionByKey,
	getUpdatePermissionByKey,

	getStateToSave,

	getSubstate,
};