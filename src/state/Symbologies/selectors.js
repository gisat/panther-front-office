import {createSelector} from 'reselect';
import _ from 'lodash';

const getSymbologies = state => state.symbologies.data;

export default {
	getSymbologies: getSymbologies
};