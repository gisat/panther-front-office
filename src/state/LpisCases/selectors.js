import {createSelector} from 'reselect';
import _ from 'lodash';

const getCases = state => state.lpisCases.cases.data;

export default {
	getCases: getCases
};