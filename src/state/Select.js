// base types
import App from './App/selectors';
import Areas from './Areas/selectors';
import Attributes from './Attributes/selectors';
import AttributeDataSources from './AttributeDataSources/selectors';
import AttributeData from './AttributeData/selectors';
import AttributeRelations from './AttributeRelations/selectors';
import AttributeSets from './AttributeSets/selectors';
import Charts from './Charts/selectors';
import Components from './Components/selectors';
import LayerPeriods from './LayerPeriods/selectors';
import LayerTemplates from './LayerTemplates/selectors';
import LayersTrees from './LayersTrees/selectors';
import Maps from './Maps/selectors';
import Periods from './Periods/selectors';
import Places from './Places/selectors';
import Scenarios from './Scenarios/selectors';
import Scopes from './Scopes/selectors';
import Screens from './Screens/selectors';
import Selections from './Selections/selectors';
import Snapshots from './Snapshots/selectors';
import SpatialDataSources from './SpatialDataSources/selectors';
import SpatialRelations from './SpatialRelations/selectors';
import Styles from './Styles/selectors';
import AttributeStatistics from './AttributeStatistics/selectors';
import Tags from './Tags/selectors';
import Users from './Users/selectors';
import Views from './Views/selectors';
import Windows from './Windows/selectors';

// specific types
import LpisChangeReviewCases from "./_specific/LpisChangeReviewCases/selectors";
import LpisCheckCases from './_specific/LpisCheckCases/selectors';

export default {
	app: App,
	areas: Areas,
	attributes: Attributes,
	attributeData: AttributeData,
	attributeDataSources: AttributeDataSources,
	attributeStatistics: AttributeStatistics,
	attributeRelations: AttributeRelations,
	attributeSets: AttributeSets,
	charts: Charts,
	components: Components,
	layerPeriods: LayerPeriods,
	layerTemplates: LayerTemplates,
	layersTrees: LayersTrees,
	maps: Maps,
	periods: Periods,
	places: Places,
	scenarios: Scenarios,
	scopes: Scopes,
	screens: Screens,
	selections: Selections,
	snapshots: Snapshots,
	spatialDataSources: SpatialDataSources,
	spatialRelations: SpatialRelations,
	styles: Styles,
	tags: Tags,
	users: Users,
	views: Views,
	windows: Windows,
	specific: {
		lpisChangeReviewCases: LpisChangeReviewCases,
		lpisCheckCases: LpisCheckCases
	}
};