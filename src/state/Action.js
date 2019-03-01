import ActionTypes from '../constants/ActionTypes';

import AOI from './AOI/actions';
import Areas from './Areas/actions';
import Attributes from './Attributes/actions';
import AttributeSets from './AttributeSets/actions';
import Choropleths from './Choropleths/actions';
import Components from './Components/actions';
import Dataviews from './Dataviews/actions';
import LayerTemplates from './LayerTemplates/actions';
import Maps from './Maps/actions';
import Periods from './Periods/actions';
import Places from './Places/actions';
import Scenarios from './Scenarios/actions';
import Scopes from './Scopes/actions';
import Snapshots from './Snapshots/actions';
import SpatialDataSources from './SpatialDataSources/actions';
import SpatialRelations from './SpatialRelations/actions';
import Styles from './Styles/actions';
import Themes from './_Themes/actions';
import Topics from './_Topics/actions';
import Users from './Users/actions';
import UserGroups from './UserGroups/actions';
import Visualizations from './_Visualizations/actions';
import WmsLayers from './WmsLayers/actions';

// specific types
import LpisChangeReviewCases from './_specific/LpisChangeReviewCases/actions';
import LpisCheckCases from './_specific/LpisCheckCases/actions';

export default {

	aoi: AOI,
	areas: Areas,
	attributes: Attributes,
	attributeSets: AttributeSets,
	choropleths: Choropleths,
	components: Components,
	dataviews: Dataviews,
	layerTemplates: LayerTemplates,
	maps: Maps,
	periods: Periods,
	places: Places,
	scenarios: Scenarios,
	scopes: Scopes,
	snapshots: Snapshots,
	spatialDataSources: SpatialDataSources,
	spatialRelations: SpatialRelations,
	styles: Styles,
	themes: Themes,
	topics: Topics,
	users: Users,
	userGroups: UserGroups,
	visualizations: Visualizations,
	wmsLayers: WmsLayers,
	specific: {
		lpisChangeReviewCases: LpisChangeReviewCases,
		lpisCheckCases: LpisCheckCases,
	}
};
