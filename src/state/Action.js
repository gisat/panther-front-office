import ActionTypes from '../constants/ActionTypes';

import App from './App/actions';
import Areas from './Areas/actions';
import Attributes from './Attributes/actions';
import AttributeRelations from './AttributeRelations/actions';
import AttributeDataSources from './AttributeDataSources/actions';
import AttributeSets from './AttributeSets/actions';
import Components from './Components/actions';
import LayerTemplates from './LayerTemplates/actions';
import LayersTrees from './LayersTrees/actions';
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
import Tags from './Tags/actions';
import Users from './Users/actions';
import Views from './Views/actions';
import Windows from './Windows/actions';


// specific types
import LpisChangeReviewCases from './_specific/LpisChangeReviewCases/actions';
import LpisCheckCases from './_specific/LpisCheckCases/actions';

export default {
	app: App,
	areas: Areas,
	attributes: Attributes,
	attributesDataSources: AttributeDataSources,
	attributeRelations: AttributeRelations,
	attributeSets: AttributeSets,
	components: Components,
	layerTemplates: LayerTemplates,
	layersTrees: LayersTrees,
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
	tags: Tags,
	views: Views,
	users: Users,
	windows: Windows,
	specific: {
		lpisChangeReviewCases: LpisChangeReviewCases,
		lpisCheckCases: LpisCheckCases,
	}
};
