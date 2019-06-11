import {createSelector} from 'reselect';
import _ from 'lodash';

const getKey = state => state.app.key;
const getLocalConfiguration = state => state.app.localConfiguration;

export default {
	getKey,
	getLocalConfiguration
};