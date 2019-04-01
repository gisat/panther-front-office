import {createSelector} from 'reselect';
import _ from 'lodash';

const getKey = state => state.app.key;

export default {
	getKey
};