import ActionTypes from '../constants/ActionTypes';

import Areas from './Areas/actions';
import Attributes from './Attributes/actions';
import AttributeSets from './AttributeSets/actions';
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
import Users from './Users/actions';

// specific types
import LpisChangeReviewCases from './_specific/LpisChangeReviewCases/actions';
import LpisCheckCases from './_specific/LpisCheckCases/actions';

export default {

	areas: Areas,
	attributes: Attributes,
	attributeSets: AttributeSets,
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
	users: Users,
	specific: {
		lpisChangeReviewCases: LpisChangeReviewCases,
		lpisCheckCases: LpisCheckCases,
	}
};
