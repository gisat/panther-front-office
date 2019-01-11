import {createSelector} from 'reselect';
import _ from 'lodash';
import common from '../_common/selectors';


const getSubstate = state => state.attributes;

const getAttributes =  common.getAll(getSubstate);
const getAllForDataview = common.getAllForDataview(getSubstate);
const getAllForDataviewAsObject = common.getAllForDataviewAsObject(getSubstate);

const isInitializedForExt = common.isInitializedForExt(getSubstate);

export default {
	getAttributes,

	getAllForDataview,
	getAllForDataviewAsObject,
	getSubstate,

	isInitializedForExt
};