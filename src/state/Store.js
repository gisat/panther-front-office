import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// base types
import appReducers from './App/reducers';
import areasReducers from './Areas/reducers';
import areasRelationsReducers from './AreaRelations/reducers';
import attributesReducers from './Attributes/reducers';
import attributeDataReducers from './AttributeData/reducers';
import attributeRelationsReducers from './AttributeRelations/reducers';
import attributeSetsReducers from './AttributeSets/reducers';
import componentsReducers from './Components/reducers';
import chartsReducers from './Charts/reducers';
import layerPeriodsReducers from './LayerPeriods/reducers';
import layerTemplatesReducers from './LayerTemplates/reducers';
import layersTreesReducers from './LayersTrees/reducers';
import mapsReducers from './Maps/reducers';
import periodsReducers from './Periods/reducers';
import placesReducers from './Places/reducers';
import scenariosReducers from './Scenarios/reducers';
import scopesReducers from './Scopes/reducers';
import screensReducers from './Screens/reducers';
import selectionsReducers from './Selections/reducers';
import snapshotsReducers from './Snapshots/reducers';
import spatialDataReducers from './SpatialData/reducers';
import spatialDataSourcesReducers from './SpatialDataSources/reducers';
import spatialVectorDataSourcesReducers from './SpatialDataSources/vector/reducers';
import spatialRelationsReducers from './SpatialRelations/reducers';
import stylesReducers from './Styles/reducers';
import attributeStatisticsReducers from './AttributeStatistics/reducers';
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
	areaRelations: areasRelationsReducers,
	attributes: attributesReducers,
	attributeData: attributeDataReducers,
	attributeRelations: attributeRelationsReducers,
	attributeStatistics: attributeStatisticsReducers,
	attributeSets: attributeSetsReducers,
	charts: chartsReducers,
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
	selections: selectionsReducers,
	snapshots: snapshotsReducers,
	spatialData: spatialDataReducers,
	spatialDataSources: spatialDataSourcesReducers,
	spatialVectorDataSources: spatialVectorDataSourcesReducers,
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
