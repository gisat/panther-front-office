import ActionTypes from '../constants/ActionTypes';

import AOI from './AOI/actions';
import Attributes from './Attributes/actions';
import AttributeSets from './AttributeSets/actions';
import Components from './Components/actions';
import Maps from './Maps/actions';
import Periods from './Periods/actions';
import Places from './Places/actions';
import Scopes from './Scopes/actions';
import User from './User/actions';
import WmsLayers from './WmsLayers/actions';

export default {

	aoi: AOI,
	attributes: Attributes,
	attributeSets: AttributeSets,
	components: Components,
	maps: Maps,
	periods: Periods,
	places: Places,
	scopes: Scopes,
	user: User,
	wmsLayers: WmsLayers
};
