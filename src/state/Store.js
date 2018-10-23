import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import aoiReducers from './AOI/reducers';
import areasReducers from './Areas/reducers';
import attributesReducers from './Attributes/reducers';
import attributeSetsReducers from './AttributeSets/reducers';
import choroplethReducers from './Choropleths/reducers';
import componentsReducers from './Components/reducers';
import layerPeriodsReducers from './LayerPeriods/reducers';
import layerTemplatesReducers from './LayerTemplates/reducers';
import lpisCasesReducers from './LpisCases/reducers';
import mapsReducers from './Maps/reducers';
import periodsReducers from './Periods/reducers';
import placesReducers from './Places/reducers';
import scenariosReducers from './Scenarios/reducers';
import scopesReducers from './Scopes/reducers';
import spatialDataSourcesReducers from './SpatialDataSources/reducers';
import spatialRelationsReducers from './SpatialRelations/reducers';
import stylesReducers from './Styles/reducers';
import usersReducers from './Users/reducers';
import userGroupsReducers from './UserGroups/reducers';
import viewsReducers from './Views/reducers';
import wmsLayersReducers from './WmsLayers/reducers';

import subscribers from '../subscribers';

// Redux store
const Store = createStore(combineReducers({
	aoi: aoiReducers,
	areas: areasReducers,
	attributes: attributesReducers,
	attributeSets: attributeSetsReducers,
	choropleths: choroplethReducers,
	components: componentsReducers,
	layerPeriods: layerPeriodsReducers,
	layerTemplates: layerTemplatesReducers,
	lpisCases: lpisCasesReducers,
	maps: mapsReducers,
	periods: periodsReducers,
	places: placesReducers,
	scenarios: scenariosReducers,
	scopes: scopesReducers,
	spatialDataSources: spatialDataSourcesReducers,
	spatialRelations: spatialRelationsReducers,
	styles: stylesReducers,
	users: usersReducers,
	userGroups: userGroupsReducers,
	views: viewsReducers,
	wmsLayers: wmsLayersReducers
}), applyMiddleware(thunk, logger));

subscribers(Store);

export default Store;
