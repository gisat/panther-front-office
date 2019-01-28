import {createSelector} from 'reselect';
import _ from 'lodash';

import vectorSelectors from './vector/selectors';

const getSubstate = (state) => state.spatialDataSources;

export default {
	getSubstate,
	vector: vectorSelectors
};