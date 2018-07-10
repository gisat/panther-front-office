import {createSelector} from 'reselect';
import _ from 'lodash';

const getViews = state => state.views.data;

export default {
	getViews: getViews
};