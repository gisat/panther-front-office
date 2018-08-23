import ActionTypes from '../constants/ActionTypes';

import AOI from './AOI/actions';
import Attributes from './Attributes/actions';
import AttributeSets from './AttributeSets/actions';
import Components from './Components/actions';
import LayerTemplates from './LayerTemplates/actions';
import LpisCases from './LpisCases/actions';
import Maps from './Maps/actions';
import Periods from './Periods/actions';
import Places from './Places/actions';
import Scenarios from './Scenarios/actions';
import Scopes from './Scopes/actions';
import SpatialDataSources from './SpatialDataSources/actions';
import SpatialRelations from './SpatialRelations/actions';
import Symbologies from './Symbologies/actions';
import Users from './Users/actions';
import UserGroups from './UserGroups/actions';
import Views from './Views/actions';
import WmsLayers from './WmsLayers/actions';

export default {

	aoi: AOI,
	attributes: Attributes,
	attributeSets: AttributeSets,
	components: Components,
	layerTemplates: LayerTemplates,
	lpisCases: LpisCases,
	maps: Maps,
	periods: Periods,
	places: Places,
	scenarios: Scenarios,
	scopes: Scopes,
	spatialDataSources: SpatialDataSources,
	spatialRelations: SpatialRelations,
	symbologies: Symbologies,
	users: Users,
	userGroups: UserGroups,
	views: Views,
	wmsLayers: WmsLayers
};
