import ActionTypes from '../constants/ActionTypes';

import AOI from './AOI/actions';
import Attributes from './Attributes/actions';
import AttributeSets from './AttributeSets/actions';
import Components from './Components/actions';
import Maps from './Maps/actions';
import Periods from './Periods/actions';
import Places from './Places/actions';
import Scenarios from './Scenarios/actions';
import Scopes from './Scopes/actions';
import SpatialDataSources from './SpatialDataSources/actions';
import SpatialRelations from './SpatialRelations/actions';
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
	scenarios: Scenarios,
	scopes: Scopes,
	spatialDataSources: SpatialDataSources,
	spatialRelations: SpatialRelations,
	user: User,
	wmsLayers: WmsLayers
};
