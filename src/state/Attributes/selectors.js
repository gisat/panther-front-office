import {createSelector} from 'reselect';
import _ from 'lodash';

const getAttributes = state => state.attributes.data;

export default {
	getAttributes: getAttributes
};