import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// base types
import appReducers from './App/reducers';
import areasReducers from './Areas/reducers';
import attributesReducers from './Attributes/reducers';
import attributeRelationsReducers from './attributeRelations/reducers';
import attributeSetsReducers from './AttributeSets/reducers';
import componentsReducers from './Components/reducers';
import layerPeriodsReducers from './LayerPeriods/reducers';
import layerTemplatesReducers from './LayerTemplates/reducers';
import layersTreesReducers from './LayersTrees/reducers';
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
import windowsReducers from './Windows/reducers';


// specific types
import lpisChangeReviewCasesReducers from './_specific/LpisChangeReviewCases/reducers';
import lpisCheckCasesReducers from './_specific/LpisCheckCases/reducers';


// Redux store
const Store = createStore(combineReducers({
	app: appReducers,
	areas: areasReducers,
	attributes: attributesReducers,
	attributeRelations: attributeRelationsReducers,
	attributeSets: attributeSetsReducers,
	components: componentsReducers,
	layerPeriods: layerPeriodsReducers,
	layerTemplates: layerTemplatesReducers,
	layersTrees: layersTreesReducers,
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
	windowsReducers: windowsReducers,
	specific: combineReducers({
		lpisChangeReviewCases: lpisChangeReviewCasesReducers,
		lpisCheckCases: lpisCheckCasesReducers,
	})
}), applyMiddleware(thunk, logger));


export default Store;
