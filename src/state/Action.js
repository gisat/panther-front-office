import ActionTypes from '../constants/ActionTypes';

import Apps from './Apps/actions';
import Areas from './Areas/actions';
import Attributes from './Attributes/actions';
import AttributeSets from './AttributeSets/actions';
import Components from './Components/actions';
import LayerTemplates from './LayerTemplates/actions';
import Maps from './Maps/actions';
import Periods from './Periods/actions';
import Places from './Places/actions';
import Scenarios from './Scenarios/actions';
import Scopes from './Scopes/actions';
import Screens from './Screens/actions';
import Snapshots from './Snapshots/actions';
import SpatialDataSources from './SpatialDataSources/actions';
import SpatialRelations from './SpatialRelations/actions';
import Styles from './Styles/actions';
import Users from './Users/actions';

// specific types
import LpisChangeReviewCases from './_specific/LpisChangeReviewCases/actions';
import LpisCheckCases from './_specific/LpisCheckCases/actions';

export default {

	apps: Apps,
	areas: Areas,
	attributes: Attributes,
	attributeSets: AttributeSets,
	components: Components,
	layerTemplates: LayerTemplates,
	maps: Maps,
	periods: Periods,
	places: Places,
	scenarios: Scenarios,
	scopes: Scopes,
	screens: Screens,
	snapshots: Snapshots,
	spatialDataSources: SpatialDataSources,
	spatialRelations: SpatialRelations,
	styles: Styles,
	users: Users,
	specific: {
		lpisChangeReviewCases: LpisChangeReviewCases,
		lpisCheckCases: LpisCheckCases,
	}
};
