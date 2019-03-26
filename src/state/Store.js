import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// base types
import areasReducers from './Areas/reducers';
import attributesReducers from './Attributes/reducers';
import attributeSetsReducers from './AttributeSets/reducers';
import componentsReducers from './Components/reducers';
import layerPeriodsReducers from './LayerPeriods/reducers';
import layerTemplatesReducers from './LayerTemplates/reducers';
import mapsReducers from './Maps/reducers';
import periodsReducers from './Periods/reducers';
import placesReducers from './Places/reducers';
import scenariosReducers from './Scenarios/reducers';
import scopesReducers from './Scopes/reducers';
import screensReducers from './Screens/reducers';
import snapshotsReducers from './Snapshots/reducers';
import spatialDataSourcesReducers from './SpatialDataSources/reducers';
import spatialRelationsReducers from './SpatialRelations/reducers';
import stylesReducers from './Styles/reducers';
import tagsReducers from './Tags/reducers';
import usersReducers from './Users/reducers';
import viewsReducers from './Views/reducers';


// specific types
import lpisChangeReviewCasesReducers from './_specific/LpisChangeReviewCases/reducers';
import lpisCheckCasesReducers from './_specific/LpisCheckCases/reducers';


// Redux store
const Store = createStore(combineReducers({
	areas: areasReducers,
	attributes: attributesReducers,
	attributeSets: attributeSetsReducers,
	components: componentsReducers,
	layerPeriods: layerPeriodsReducers,
	layerTemplates: layerTemplatesReducers,
	maps: mapsReducers,
	periods: periodsReducers,
	places: placesReducers,
	scenarios: scenariosReducers,
	scopes: scopesReducers,
	screens: screensReducers,
	snapshots: snapshotsReducers,
	spatialDataSources: spatialDataSourcesReducers,
	spatialRelations: spatialRelationsReducers,
	styles: stylesReducers,
	tags: tagsReducers,
	users: usersReducers,
	views: viewsReducers,
	specific: combineReducers({
		lpisChangeReviewCases: lpisChangeReviewCasesReducers,
		lpisCheckCases: lpisCheckCasesReducers,
	})
}), applyMiddleware(thunk, logger));


export default Store;
