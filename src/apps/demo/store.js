import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// base types
import areasReducers from '../../state/Areas/reducers';
import attributesReducers from '../../state/Attributes/reducers';
import attributeSetsReducers from '../../state/AttributeSets/reducers';
import componentsReducers from '../../state/Components/reducers';
import layerPeriodsReducers from '../../state/LayerPeriods/reducers';
import layerTemplatesReducers from '../../state/LayerTemplates/reducers';
import mapsReducers from '../../state/Maps/reducers';
import periodsReducers from '../../state/Periods/reducers';
import placesReducers from '../../state/Places/reducers';
import scenariosReducers from '../../state/Scenarios/reducers';
import scopesReducers from '../../state/Scopes/reducers';
import screensReducers from '../../state/Screens/reducers';
import snapshotsReducers from '../../state/Snapshots/reducers';
import spatialDataSourcesReducers from '../../state/SpatialDataSources/reducers';
import spatialRelationsReducers from '../../state/SpatialRelations/reducers';
import stylesReducers from '../../state/Styles/reducers';
import usersReducers from '../../state/Users/reducers';

// Redux store
export default createStore(combineReducers({
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
	users: usersReducers,
}), applyMiddleware(thunk, logger));