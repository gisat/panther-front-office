// base types
import _deprecatedSelections from './_deprecatedSelections/selectors';

import App from './App/selectors';
import Areas from './Areas/selectors';
import AreaRelations from './AreaRelations/selectors';
import Attributes from './Attributes/selectors';
import AttributeDataSources from './AttributeDataSources/selectors';
import AttributeData from './AttributeData/selectors';
import AttributeRelations from './AttributeRelations/selectors';
import AttributeSets from './AttributeSets/selectors';
import Cases from './Cases/selectors';
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
import SpatialData from './SpatialData/selectors';
import SpatialDataSources from './SpatialDataSources/selectors';
import SpatialRelations from './SpatialRelations/selectors';
import Styles from './Styles/selectors';
import AttributeStatistics from './AttributeStatistics/selectors';
import Tags from './Tags/selectors';
import Users from './Users/selectors';
import Views from './Views/selectors';
import Windows from './Windows/selectors';

export default {
	_deprecatedSelections: _deprecatedSelections,
	app: App,
	areas: Areas,
	areaRelations: AreaRelations,
	attributes: Attributes,
	attributeData: AttributeData,
	attributeDataSources: AttributeDataSources,
	attributeStatistics: AttributeStatistics,
	attributeRelations: AttributeRelations,
	attributeSets: AttributeSets,
	cases: Cases,
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
	spatialData: SpatialData,
	spatialDataSources: SpatialDataSources,
	spatialRelations: SpatialRelations,
	styles: Styles,
	tags: Tags,
	users: Users,
	views: Views,
	windows: Windows
};