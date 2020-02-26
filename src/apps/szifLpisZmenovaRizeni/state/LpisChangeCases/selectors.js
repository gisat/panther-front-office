import {createSelector} from 'reselect';

import {commonSelectors as common} from '@gisatcz/ptr-state';

const getSubstate = state => state.specific.lpisChangeCases;
const getIndexed = common.getIndexed(getSubstate);

export default {
	getSubstate,

	getIndexed
};