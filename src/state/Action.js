import ActionTypes from '../constants/ActionTypes';

import _deprecatedSelections from './_deprecatedSelections/actions';

import App from './App/actions';
import Areas from './Areas/actions';
import AreaRelations from './AreaRelations/actions';
import Attributes from './Attributes/actions';
import AttributeRelations from './AttributeRelations/actions';
import AttributeDataSources from './AttributeDataSources/actions';
import AttributeData from './AttributeData/actions';
import AttributeSets from './AttributeSets/actions';
import Cases from './Cases/actions';
import Charts from './Charts/actions';
import Components from './Components/actions';
import LayerTemplates from './LayerTemplates/actions';
import LayersTrees from './LayersTrees/actions';
import Maps from './Maps/actions';
import Periods from './Periods/actions';
import Places from './Places/actions';
import Scenarios from './Scenarios/actions';
import Scopes from './Scopes/actions';
import Screens from './Screens/actions';
import Selections from './Selections/actions';
import Snapshots from './Snapshots/actions';
import SpatialData from './SpatialData/actions';
import SpatialDataSources from './SpatialDataSources/actions';
import SpatialRelations from './SpatialRelations/actions';
import Styles from './Styles/actions';
import AttributeStatistics from './AttributeStatistics/actions';
import Tags from './Tags/actions';
import Users from './Users/actions';
import Views from './Views/actions';
import Windows from './Windows/actions';


// specific types
import LpisChangeReviewCases from './_specific/LpisChangeReviewCases/actions';
import LpisCheckCases from './_specific/LpisCheckCases/actions';

export default {
	_deprecatedSelections: _deprecatedSelections,
	app: App,
	areas: Areas,
	areaRelations: AreaRelations,
	attributes: Attributes,
	attributeData: AttributeData,
	attributeDataSources: AttributeDataSources,
	attributeRelations: AttributeRelations,
	attributeStatistics: AttributeStatistics,
	attributeSets: AttributeSets,
	cases: Cases,
	charts: Charts,
	components: Components,
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
	spatialData: SpatialData,
	spatialDataSources: SpatialDataSources,
	spatialRelations: SpatialRelations,
	styles: Styles,
	tags: Tags,
	views: Views,
	users: Users,
	windows: Windows,
	// TODO still needed?
	// specific: {
	// 	lpisChangeReviewCases: LpisChangeReviewCases,
	// 	lpisCheckCases: LpisCheckCases,
	// }
};
