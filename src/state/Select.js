// base types
import Areas from './Areas/selectors';
import Attributes from './Attributes/selectors';
import AttributeSets from './AttributeSets/selectors';
import Components from './Components/selectors';
import LayerPeriods from './LayerPeriods/selectors';
import LayerTemplates from './LayerTemplates/selectors';
import Maps from './Maps/selectors';
import Periods from './Periods/selectors';
import Places from './Places/selectors';
import Scenarios from './Scenarios/selectors';
import Scopes from './Scopes/selectors';
import Snapshots from './Snapshots/selectors';
import SpatialDataSources from './SpatialDataSources/selectors';
import SpatialRelations from './SpatialRelations/selectors';
import Styles from './Styles/selectors';
import Users from './Users/selectors';

// specific types
import LpisChangeReviewCases from "./_specific/LpisChangeReviewCases/selectors";
import LpisCheckCases from './_specific/LpisCheckCases/selectors';

export default {
	areas: Areas,
	attributes: Attributes,
	attributeSets: AttributeSets,
	components: Components,
	layerPeriods: LayerPeriods,
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
		lpisCheckCases: LpisCheckCases
	}
};