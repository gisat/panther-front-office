import {createSelector} from 'reselect';
import _ from 'lodash';

const getKey = state => state.app.key;
const getConfiguration = state => state.app.configuration;

export default {
	getKey,
	getConfiguration
};