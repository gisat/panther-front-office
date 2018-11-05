import ActionTypes from '../constants/ActionTypes';

import AOI from './AOI/actions';
import Areas from './Areas/actions';
import Attributes from './Attributes/actions';
import AttributeSets from './AttributeSets/actions';
import Choropleths from './Choropleths/actions';
import Components from './Components/actions';
import Dataviews from './Dataviews/actions';
import LayerTemplates from './LayerTemplates/actions';
import LpisCases from './LpisCases/actions';
import Maps from './Maps/actions';
import Periods from './Periods/actions';
import Places from './Places/actions';
import Scenarios from './Scenarios/actions';
import Scopes from './Scopes/actions';
import SpatialDataSources from './SpatialDataSources/actions';
import SpatialRelations from './SpatialRelations/actions';
import Styles from './Styles/actions';
import Themes from './_Themes/actions';
import Users from './Users/actions';
import UserGroups from './UserGroups/actions';
import WmsLayers from './WmsLayers/actions';

export default {

	aoi: AOI,
	areas: Areas,
	attributes: Attributes,
	attributeSets: AttributeSets,
	choropleths: Choropleths,
	components: Components,
	dataviews: Dataviews,
	layerTemplates: LayerTemplates,
	lpisCases: LpisCases,
	maps: Maps,
	periods: Periods,
	places: Places,
	scenarios: Scenarios,
	scopes: Scopes,
	spatialDataSources: SpatialDataSources,
	spatialRelations: SpatialRelations,
	styles: Styles,
	themes: Themes,
	users: Users,
	userGroups: UserGroups,
	wmsLayers: WmsLayers
};
