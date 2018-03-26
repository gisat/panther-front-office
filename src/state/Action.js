import ActionTypes from '../constants/ActionTypes';

import AOI from './AOI/actions';
import Maps from './Maps/actions';
import Periods from './Periods/actions';
import Scopes from './Scopes/actions';
import User from './User/actions';
import WmsLayers from './WmsLayers/actions';

export default {

	aoi: AOI,
	maps: Maps,
	periods: Periods,
	scopes: Scopes,
	user: User,
	wmsLayers: WmsLayers
};
