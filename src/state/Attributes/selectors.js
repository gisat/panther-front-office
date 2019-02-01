import {createSelector} from 'reselect';
import _ from 'lodash';
import common from '../_common/selectors';


const getSubstate = state => state.attributes;

const getAttributes =  common.getAll(getSubstate);

export default {
	getAttributes,
	getSubstate
};