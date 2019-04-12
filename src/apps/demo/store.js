import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// base types
import appReducers from '../../state/App/reducers';
import areasReducers from '../../state/Areas/reducers';
import attributesReducers from '../../state/Attributes/reducers';
import attributeSetsReducers from '../../state/AttributeSets/reducers';
import componentsReducers from '../../state/Components/reducers';
import layerPeriodsReducers from '../../state/LayerPeriods/reducers';
import layerTemplatesReducers from '../../state/LayerTemplates/reducers';
import layersTreesReducers from '../../state/LayersTrees/reducers';
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
import tagsReducers from '../../state/Tags/reducers';
import usersReducers from '../../state/Users/reducers';
import viewsReducers from '../../state/Views/reducers';

// Redux store
export default createStore(combineReducers({
	app: appReducers,
	areas: areasReducers,
	attributes: attributesReducers,
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
	users: usersReducers,
	tags: tagsReducers,
	views: viewsReducers
}), applyMiddleware(thunk, logger));